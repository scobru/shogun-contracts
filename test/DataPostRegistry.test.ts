import { expect } from "chai";
import { ethers } from "hardhat";
import { DataPostRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("DataPostRegistry", function () {
  let postRegistry: DataPostRegistry;
  let owner: SignerWithAddress;
  let seller1: SignerWithAddress;
  let seller2: SignerWithAddress;
  let buyer: SignerWithAddress;

  const PROOF_HASH = ethers.id("test-data-123");
  const ENCRYPTED_DATA_HASH = "QmTestCid123";
  const DESCRIPTION = "Market analysis Q4 2024 dataset";
  const CATEGORY = "analytics";
  const PRICE = ethers.parseUnits("10", 6); // 10 USDC

  beforeEach(async function () {
    [owner, seller1, seller2, buyer] = await ethers.getSigners();

    const DataPostRegistry = await ethers.getContractFactory("DataPostRegistry");
    postRegistry = await DataPostRegistry.deploy(owner.address);
    await postRegistry.waitForDeployment();
  });

  describe("Publish Post", function () {
    it("Should publish a data post with valid parameters", async function () {
      const tx = await postRegistry.connect(seller1).publishPost(
        PROOF_HASH,
        ENCRYPTED_DATA_HASH,
        DESCRIPTION,
        CATEGORY,
        PRICE
      );

      await expect(tx).to.emit(postRegistry, "DataPostPublished");

      const postId = await getPostIdFromEvent(tx);
      const post = await postRegistry.getPost(postId);

      expect(post.seller).to.equal(seller1.address);
      expect(post.proofHash).to.equal(PROOF_HASH);
      expect(post.encryptedDataHash).to.equal(ENCRYPTED_DATA_HASH);
      expect(post.description).to.equal(DESCRIPTION);
      expect(post.category).to.equal(CATEGORY);
      expect(post.priceUSDC).to.equal(PRICE);
      expect(post.active).to.be.true;
    });

    it("Should fail with empty description", async function () {
      await expect(
        postRegistry.connect(seller1).publishPost(
          PROOF_HASH,
          ENCRYPTED_DATA_HASH,
          "",
          CATEGORY,
          PRICE
        )
      ).to.be.revertedWithCustomError(postRegistry, "InvalidDescription");
    });

    it("Should fail with zero price", async function () {
      await expect(
        postRegistry.connect(seller1).publishPost(
          PROOF_HASH,
          ENCRYPTED_DATA_HASH,
          DESCRIPTION,
          CATEGORY,
          0
        )
      ).to.be.revertedWithCustomError(postRegistry, "InvalidPrice");
    });

    it("Should increment total posts counter", async function () {
      await postRegistry.connect(seller1).publishPost(
        PROOF_HASH,
        ENCRYPTED_DATA_HASH,
        DESCRIPTION,
        CATEGORY,
        PRICE
      );

      const totalPosts = await postRegistry.totalPosts();
      expect(totalPosts).to.equal(1n);

      await postRegistry.connect(seller2).publishPost(
        PROOF_HASH,
        ENCRYPTED_DATA_HASH,
        DESCRIPTION + " 2",
        CATEGORY,
        PRICE
      );

      const totalPostsAfter = await postRegistry.totalPosts();
      expect(totalPostsAfter).to.equal(2n);
    });

    it("Should add post to active posts list", async function () {
      const tx = await postRegistry.connect(seller1).publishPost(
        PROOF_HASH,
        ENCRYPTED_DATA_HASH,
        DESCRIPTION,
        CATEGORY,
        PRICE
      );

      const postId = await getPostIdFromEvent(tx);
      const activePosts = await postRegistry.getActivePosts();

      expect(activePosts.length).to.equal(1);
      expect(activePosts[0]).to.equal(postId);
    });
  });

  describe("Update Post", function () {
    let postId: string;

    beforeEach(async function () {
      const tx = await postRegistry.connect(seller1).publishPost(
        PROOF_HASH,
        ENCRYPTED_DATA_HASH,
        DESCRIPTION,
        CATEGORY,
        PRICE
      );
      postId = await getPostIdFromEvent(tx);
    });

    it("Should update post description", async function () {
      const newDescription = "Updated description";
      await postRegistry.connect(seller1).updatePost(postId, newDescription, 0);

      const post = await postRegistry.getPost(postId);
      expect(post.description).to.equal(newDescription);
    });

    it("Should update post price", async function () {
      const newPrice = ethers.parseUnits("20", 6);
      await postRegistry.connect(seller1).updatePost(postId, "", newPrice);

      const post = await postRegistry.getPost(postId);
      expect(post.priceUSDC).to.equal(newPrice);
    });

    it("Should update both description and price", async function () {
      const newDescription = "Updated description";
      const newPrice = ethers.parseUnits("20", 6);
      await postRegistry.connect(seller1).updatePost(postId, newDescription, newPrice);

      const post = await postRegistry.getPost(postId);
      expect(post.description).to.equal(newDescription);
      expect(post.priceUSDC).to.equal(newPrice);
    });

    it("Should fail if not post owner", async function () {
      await expect(
        postRegistry.connect(seller2).updatePost(postId, "New desc", 0)
      ).to.be.revertedWithCustomError(postRegistry, "NotPostOwner");
    });

    it("Should fail if post not found", async function () {
      const fakePostId = ethers.id("fake-post");
      await expect(
        postRegistry.connect(seller1).updatePost(fakePostId, "New desc", 0)
      ).to.be.revertedWithCustomError(postRegistry, "PostNotFound");
    });
  });

  describe("Deactivate Post", function () {
    let postId: string;

    beforeEach(async function () {
      const tx = await postRegistry.connect(seller1).publishPost(
        PROOF_HASH,
        ENCRYPTED_DATA_HASH,
        DESCRIPTION,
        CATEGORY,
        PRICE
      );
      postId = await getPostIdFromEvent(tx);
    });

    it("Should deactivate a post", async function () {
      await expect(
        postRegistry.connect(seller1).deactivatePost(postId)
      ).to.emit(postRegistry, "DataPostDeactivated");

      const post = await postRegistry.getPost(postId);
      expect(post.active).to.be.false;
    });

    it("Should remove post from active posts list", async function () {
      const activePostsBefore = await postRegistry.getActivePosts();
      expect(activePostsBefore.length).to.equal(1);

      await postRegistry.connect(seller1).deactivatePost(postId);

      const activePostsAfter = await postRegistry.getActivePosts();
      expect(activePostsAfter.length).to.equal(0);
    });

    it("Should fail if not post owner", async function () {
      await expect(
        postRegistry.connect(seller2).deactivatePost(postId)
      ).to.be.revertedWithCustomError(postRegistry, "NotPostOwner");
    });
  });

  describe("Discovery", function () {
    let postId1: string;
    let postId2: string;
    let postId3: string;

    beforeEach(async function () {
      // Seller1 posts in analytics
      const tx1 = await postRegistry.connect(seller1).publishPost(
        PROOF_HASH,
        ENCRYPTED_DATA_HASH,
        DESCRIPTION,
        "analytics",
        PRICE
      );
      postId1 = await getPostIdFromEvent(tx1);

      // Seller1 posts another in analytics
      const tx2 = await postRegistry.connect(seller1).publishPost(
        PROOF_HASH,
        ENCRYPTED_DATA_HASH + "2",
        DESCRIPTION + " 2",
        "analytics",
        ethers.parseUnits("20", 6)
      );
      postId2 = await getPostIdFromEvent(tx2);

      // Seller2 posts in research
      const tx3 = await postRegistry.connect(seller2).publishPost(
        PROOF_HASH,
        ENCRYPTED_DATA_HASH + "3",
        "Research data",
        "research",
        ethers.parseUnits("5", 6)
      );
      postId3 = await getPostIdFromEvent(tx3);
    });

    it("Should get posts by seller", async function () {
      const seller1Posts = await postRegistry.getPostsBySeller(seller1.address);
      expect(seller1Posts.length).to.equal(2);
      expect(seller1Posts).to.include(postId1);
      expect(seller1Posts).to.include(postId2);

      const seller2Posts = await postRegistry.getPostsBySeller(seller2.address);
      expect(seller2Posts.length).to.equal(1);
      expect(seller2Posts[0]).to.equal(postId3);
    });

    it("Should get posts by category", async function () {
      const analyticsPosts = await postRegistry.getPostsByCategory("analytics");
      expect(analyticsPosts.length).to.equal(2);
      expect(analyticsPosts).to.include(postId1);
      expect(analyticsPosts).to.include(postId2);

      const researchPosts = await postRegistry.getPostsByCategory("research");
      expect(researchPosts.length).to.equal(1);
      expect(researchPosts[0]).to.equal(postId3);
    });

    it("Should get all active posts", async function () {
      const activePosts = await postRegistry.getActivePosts();
      expect(activePosts.length).to.equal(3);
      expect(activePosts).to.include(postId1);
      expect(activePosts).to.include(postId2);
      expect(activePosts).to.include(postId3);
    });

    it("Should exclude deactivated posts from active list", async function () {
      await postRegistry.connect(seller1).deactivatePost(postId1);

      const activePosts = await postRegistry.getActivePosts();
      expect(activePosts.length).to.equal(2);
      expect(activePosts).to.not.include(postId1);
      expect(activePosts).to.include(postId2);
      expect(activePosts).to.include(postId3);
    });

    it("Should return correct active post count", async function () {
      let count = await postRegistry.getActivePostCount();
      expect(count).to.equal(3n);

      await postRegistry.connect(seller1).deactivatePost(postId1);
      count = await postRegistry.getActivePostCount();
      expect(count).to.equal(2n);
    });
  });

  describe("Pausable", function () {
    it("Should pause and unpause", async function () {
      await postRegistry.connect(owner).pause();
      await expect(
        postRegistry.connect(seller1).publishPost(
          PROOF_HASH,
          ENCRYPTED_DATA_HASH,
          DESCRIPTION,
          CATEGORY,
          PRICE
        )
      ).to.be.revertedWithCustomError(postRegistry, "EnforcedPause");

      await postRegistry.connect(owner).unpause();
      await expect(
        postRegistry.connect(seller1).publishPost(
          PROOF_HASH,
          ENCRYPTED_DATA_HASH,
          DESCRIPTION,
          CATEGORY,
          PRICE
        )
      ).to.not.be.reverted;
    });

    it("Should fail to pause if not owner", async function () {
      await expect(
        postRegistry.connect(seller1).pause()
      ).to.be.revertedWithCustomError(postRegistry, "OwnableUnauthorizedAccount");
    });
  });

  // Helper function to extract postId from event
  async function getPostIdFromEvent(tx: any): Promise<string> {
    const receipt = await tx.wait();
    const eventSig = ethers.id("DataPostPublished(bytes32,address,bytes32,string,string,uint256)");
    const event = receipt.logs.find(
      (log: any) => log.topics[0] === eventSig
    );
    
    if (!event) {
      throw new Error("DataPostPublished event not found");
    }
    
    // postId is the first indexed parameter (bytes32), so it's in topics[1]
    return ethers.hexlify(event.topics[1]);
  }
});

