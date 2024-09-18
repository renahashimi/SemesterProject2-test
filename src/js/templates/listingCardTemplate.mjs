import { handleBid } from "../api/listings/bid.mjs";
import { removeListing } from "../api/listings/delete.mjs";
import { countdown } from "../handlers/countdown.mjs";
import { formatDate } from "../handlers/date.mjs";
import { isAuthenticated } from "../handlers/isAuthenticated.mjs";
import { openLoginOverlay } from "../handlers/overlayUtils.mjs";
import { load } from "../storage/index.mjs";

const token = load("token");

export function createListingCard(listing, buttonType) {
  const postContainer = document.createElement("div");
  postContainer.classList.add(
    "postContainer", 
    "row", 
    "d-block", 
    "m-auto", 
    "mt-3",
    "justify-content-center", 
  );
  
  const postContent = document.createElement("div");
  postContent.classList.add(
    "postContent",  
    "container-fluid", 
    "d-flex", 
    "rounded", 
    "my-2", 
    "p-1", 
    "justify-content-center"
  );
 
  const postCardContent = document.createElement("div");
  postCardContent.style.height = "100%";
  postCardContent.style.maxWidth = "350px";
  postCardContent.classList.add(
    "postcard-content", 
  );

  const postCard = document.createElement("div");
  postCard.style.flex = "1 1 350px";
  postCard.style.width = "100%";
  postCard.style.maxHeight = "100%";
  postCard.style.overflow = "hidden";
  postCard.style.flexShrink = "0";
  postCard.classList.add(
    "postCard", 
    "container-md", 
    "d-block", 
    "rounded", 
    "my-2", 
    "p-1", 
    "justify-content-center",
    "align-items-center"
  );

  const postAllContent = document.createElement("div");
  postAllContent.style.width = "300px";
  postAllContent.classList.add(
    "postAllContent",  
    "d-block", 
    "rounded", 
    "shadowBorder10",
    "justify-content-center"
  );
  
  const headContent = document.createElement("div")
  headContent.classList.add(
    "d-flex",
    "justify-content-between",
    "mb-2",
    "border",
    "border-tealgreen",
    "border-2",
    "rounded-pill",
    "w-100"
  )
  const sellerInfo = document.createElement("div")
  sellerInfo.classList.add("d-flex")
  
  // Avatar
  if (listing.seller?.avatar) {
    const avatar = document.createElement("img");
    avatar.src = listing.seller.avatar.url;
    avatar.alt = listing.seller.avatar.alt || "Seller avatar";
    avatar.style.width = "50px";
    avatar.style.height = "50px";
    avatar.style.borderRadius = "50%";
    avatar.style.objectFit = "cover";
    avatar.classList.add(
      "seller-avatar", 
      "m-2", 
      "border", 
      "border-2", 
      "border-secondary"
    );
    sellerInfo.appendChild(avatar);
  }

  const sellerNameUrl = document.createElement("a");
  const sellerName = document.createElement("h2");
  sellerName.textContent = `${listing.seller.name || 'Unknown'}`;
  sellerName.classList.add(
    "seller-name", 
    "fs-6",
    "mt-4",
    "text-tealgreen"
  );
    sellerNameUrl.href = `/feed/profile/profiles/?name=${listing.seller.name}`;
    sellerNameUrl.appendChild(sellerName)

  // Button creation based on buttonType
  const buttonCnt = document.createElement("div");
  buttonCnt.classList.add("d-flex", "p-2");

  let viewButton;

  if (buttonType === "my-listing") {
    // Toggle button with Update and Delete options
    viewButton = document.createElement("button");
    viewButton.classList.add(
        "toggleBtn",
        "btn-white",
        "font-tenor",
        "fs-8",
        "p-0",
        "px-2",
        "border",
        "border-2",
        "border-secondary",
        "rounded-pill"
    );
    viewButton.innerHTML = `<i class="bi bi-gear"></i>`; 
    viewButton.style.width = "50px";
    viewButton.style.height = "50px";

    const toggleMenu = document.createElement("div");
    toggleMenu.classList.add("toggleMenu", "d-none", "position-absolute", "bg-white", "border", "border-secondary");

    const updateBtn = document.createElement("button");
    updateBtn.textContent = "Update";
    updateBtn.classList.add(
        "btn",
        "btn-primary",
        "fs-8",
        "m-1"
    );
    updateBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const listingId = listing.id;
        window.location.href = `/feed/listings/edit/?listing=${listingId}`;
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add(
        "btn",
        "btn-danger",
        "fs-8",
        "m-1"
    );
    deleteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this listing?")) {
            try {
                const listingId = listing.id;
                await removeListing(listingId); 
                postContainer.remove();
            } catch (error) {
                console.error('Error deleting listing:', error);
            }
        }
    });

    toggleMenu.appendChild(updateBtn);
    toggleMenu.appendChild(deleteBtn);
    viewButton.appendChild(toggleMenu);

    viewButton.addEventListener("click", () => {
        toggleMenu.classList.toggle("d-none");
    });

} else {
    // Default to "See More" button
    viewButton = document.createElement("button");
    viewButton.classList.add(
        "seeBtn",
        "btn-white",
        "font-tenor",
        "fs-8",
        "p-0",
        "px-2",
        "border",
        "border-2",
        "border-secondary",
        "rounded-pill"
    );
    viewButton.textContent = "See More";
    viewButton.style.width = "50px";
    viewButton.style.height = "50px";
    viewButton.addEventListener("click", (e) => {
        e.stopPropagation();
        window.location.href = `/feed/listings/singleItem/?listing=${listing.id}`;
    });
}

  buttonCnt.appendChild(viewButton);
  postContent.appendChild(buttonCnt);

  sellerInfo.appendChild(sellerNameUrl);
  headContent.appendChild(sellerInfo);
  headContent.appendChild(buttonCnt);
  postContent.appendChild(headContent);

  const imgContent = document.createElement("div");
  imgContent.style.objectFit = "cover";
  imgContent.style.height = "320px";
  imgContent.classList.add(
    "img-content"
  );

  // Image
if (listing.media && listing.media.length > 0) {
  if (listing.media.length === 1) {
    const img = document.createElement("img");
    img.src = listing.media[0].url;
    img.alt = listing.media[0].alt || "listing image";
    img.style.width = "100%";
    img.style.height = "300px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "5px";
    img.classList.add(
      "postcard-image", 
      "border", 
      "border-2", 
      "border-secondary"
    );
    imgContent.appendChild(img);
  } else {
    const scrollContainer = document.createElement("div");
    scrollContainer.style.display = "flex";
    scrollContainer.style.overflowX = "auto";
    scrollContainer.style.overflowY = "hidden"; 
    scrollContainer.style.width = "100%";
    scrollContainer.style.width = "300px";
    scrollContainer.style.height = "300px";
    scrollContainer.style.borderRadius = "5px";
    scrollContainer.classList.add(
      "scrollbar-visible",
      "border", 
      "border-2", 
      "border-secondary", 
      "m-1"
    );

    listing.media.forEach((mediaItem) => {
      const img = document.createElement("img");
      img.src = mediaItem.url;
      img.alt = mediaItem.alt || "listing image";
      img.style.height = "100%";
      img.style.flexShrink = "0";
      img.style.marginRight = "10px";
      img.style.width = "auto"; 
      img.style.objectFit = "cover";
      img.style.borderRadius = "5px";
      scrollContainer.appendChild(img);
    });
    imgContent.appendChild(scrollContainer);
  }
  } else {
    // Use default image if no images are available
    const defaultImg = document.createElement("img");
    defaultImg.src = "/src/images/noimage.jpg"; 
    defaultImg.alt = "No image available";
    defaultImg.style.width = "100%";
    defaultImg.style.height = "300px";
    defaultImg.style.objectFit = "cover";
    defaultImg.style.borderRadius = "5px";
    defaultImg.classList.add(
      "postcard-image", 
      "m-auto", "border", 
      "border-2", 
      "border-secondary"
    );
    imgContent.appendChild(defaultImg);
  }

  // Title
  const title = document.createElement("h2");
  title.classList.add(
    "listingTitle", 
    "font-tenor", 
    "postcard-title", 
    "fs-6", 
    "pt-2",
    "ps-2",
    "pb-1", 
    "text-uppercase", 
    "text-primary",
    "rounded-pill"
  );
  title.textContent = listing.title || "No title available";

  // Description  
  const descriptionContainer = document.createElement("div");
  descriptionContainer.classList.add("description-container");

  const description = document.createElement("p");
  description.classList.add(
    "postcard-description", 
    "font-raleway", 
    "fs-7",
    "border-start", 
    "border-3", 
    "border-secondary", 
    "ps-2",
    "overflow-hidden" 
  );
  description.textContent = listing.description ? `"${listing.description}"` : `"No description available"`;

  // Append description to the container
  descriptionContainer.appendChild(description);

  // Tags
  const tagsContainer = document.createElement("div");
  tagsContainer.style.height = "35px";
  tagsContainer.classList.add(
    "postcard-tags", 
    "m-auto",
    "my-1", 
    "py-1",
    "justify-content-between"
  );

  tagsContainer.innerHTML = '';

  if (listing.tags && listing.tags.length > 0) {
      listing.tags.forEach((tag) => {
          const tagElement = document.createElement("span");
          tagElement.classList.add(
              "badge", 
              "border", 
              "border-2", 
              "border-tealgreen", 
              "bg-white",
              "text-primary", 
              "me-1"
          );
          tagElement.textContent = `${tag}`;
          tagsContainer.appendChild(tagElement);
      });
  } else {
      const noTagsElement = document.createElement("span");
      noTagsElement.classList.add("text-uppercase", "fs-8", "text-secondary", "border-top",)
      noTagsElement.textContent = "No tags Available";
      tagsContainer.appendChild(noTagsElement);
  }

    // Created date
  const createdDate = document.createElement("p");
  createdDate.classList.add(
    "created-date", 
    "fs-7",
    "bg-white",
    "p-0",
    "m-0"
  );
  createdDate.textContent = formatDate(listing.created);


  // End time and bid controls
  const detailsContainer = document.createElement("div");
  detailsContainer.classList.add(
    "detailsContainer", 
    "d-block", 
    "justify-content-center", 
    "m-auto",
    "p-0"
  );
  
  const endTimeAndBidBtnContainer = document.createElement("div");
  endTimeAndBidBtnContainer.classList.add(
    "d-block", 
    "justify-content-between", 
    "border-top", 
    "border-bottom", 
    "border-4", 
    "border-tealgreen", 
    "pt-1", 
    "pb-2"
  );

  const endTimeContent = document.createElement("div");
  
  const bidBtnContent = document.createElement("div");
  bidBtnContent.id = `bidBtnContent-${listing.id}`;
  bidBtnContent.classList.add(
    "bidBtnContent", 
    "d-flex", 
    "bg-white", 
    "justify-content-center", 
    "text-center", 
    "px-1", 
    "m-0",
    "rounded-pill", 
    "border-tealgreen"
  );

  const endText = document.createElement("p");
  endText.classList.add("countdownText", "font-raleway", "text-center", "text-primary");
  endText.innerHTML = `<strong>TIME REMAINING:</strong>`;
  endTimeAndBidBtnContainer.appendChild(endText);

  const endDate = document.createElement("div");
  endDate.classList.add(
    "countdown", 
    "font-ralwaye-900", 
    "text-center",
  );
  endDate.innerHTML = `<div id="countdown-${listing.id}"></div>`;
  endTimeContent.appendChild(endDate);

  // Bid Amount Selector and Button
  const bidControls = document.createElement("div");
  bidControls.id = `bidControls-${listing.id}`; 
  bidControls.classList.add(
    "bidControls",
    "d-flex", 
    "bg-white", 
    "justify-content-center", 
    "text-center", 
    "rounded-pill", 
    "border-secondary", 
    "border", 
    "border-3"
  )

  const bidAmountContainer = document.createElement("div");
  bidAmountContainer.classList.add("bid-amount-container", "w-100", "d-flex", "bg-tealgreen", "justify-content-between", "text-center", "px-1", "rounded-pill", "border-tealgreen");

  const bidAmountInput = document.createElement("input");
  bidAmountInput.type = "number";  
  bidAmountInput.placeholder = "Enter bid amount";
  bidAmountInput.style.maxWidth = "200px";
  bidAmountInput.style.fontSize = "1rem";
  bidAmountInput.disabled = false; 
  bidAmountInput.id = `bidAmountInput-${listing.id}`; 
  bidAmountInput.classList.add(
    "bidAmountInput",
    "form-control", 
    "fs-6", 
    "ps-2",
    "m-0",
    "form-control-sm",
    "rounded-pill",
    "border-white"
  );

  const bidBtn = document.createElement("button");
  bidBtn.id = `bidBtn-${listing.id}`;  
  bidBtn.textContent = "BID";
  bidBtn.classList.add(
    "bidBtn", 
    "m-auto", 
    "font-tenor",
    "justify-content-center", 
    "text-center", 
    "text-tealgreen", 
    "bg-secondary", 
    "font-tenor", 
    "rounded-pill",
    "text-white", 
    "fs-2", 
    "px-4", 
    "mx-0",
    "border-0"
  );

  if (isAuthenticated()) {
    bidBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const bidSum = parseFloat(bidAmountInput.value);
  
      if (bidSum && !isNaN(bidSum) && bidSum > 0) {  
        try {
          await handleBid(listing.id, bidSum);
          alert('Bid placed successfully!');
          window.location.reload(); 
        } catch (error) {
          console.error("Error placing bid:", error);
          alert('Failed to place bid. Please try again.');
        }
      } else {
        alert("Please enter a valid bid amount.");
      }
    });
  } else {
    bidBtn.textContent = 'Login to place bid';
    bidBtn.classList.remove("fs-2");
    bidBtn.classList.add("fs-5", "btn-secondary");
    bidBtn.id = "bid-open-overlay-btn"; 
    bidAmountInput.style.display = "none";
  
    bidBtn.addEventListener("click", () => {
      openLoginOverlay();
      console.log('Bid button clicked');

    });
  }

  bidControls.appendChild(bidAmountInput);
  bidControls.appendChild(bidBtn);
  bidBtnContent.appendChild(bidControls);

  endTimeAndBidBtnContainer.appendChild(endTimeContent);
  endTimeAndBidBtnContainer.appendChild(bidBtnContent);
 
  
  const currentBidderContainer = document.createElement('div');
  currentBidderContainer.classList.add(
    "currentBidder",
    "font-raleway-900",
    "text-primary",
    "text-center",
    "py-1",
    "p-0",
    "m-0"
  )
 
  if (listing.bids && listing.bids.length > 0) {
    // Find the most recent bid
    const mostRecentBid = listing.bids.reduce((latest, bid) => {
      return new Date(bid.created) > new Date(latest.created) ? bid : latest;
    }, listing.bids[0]);


    const bidderDiv = document.createElement('div');
    bidderDiv.classList.add('current-bidder');
    
    const bidderName = document.createElement('span');
    bidderName.textContent = `Current bidder: ${mostRecentBid.bidder.name || 'Unknown' }`;
    bidderName.classList.add('bidder-name', 'fs-6');
    
    const bidAmount = document.createElement('span');
    bidAmount.textContent = ` -  $${mostRecentBid.amount}`;
    bidAmount.classList.add('bid-amount', 'fs-6');
    
    // Append to the container
    bidderDiv.appendChild(bidderName);
    bidderDiv.appendChild(bidAmount);
    
    currentBidderContainer.innerHTML = ''; 
    currentBidderContainer.appendChild(bidderDiv);
  } else {
    currentBidderContainer.innerHTML = '<p class="p-0 m-0">No bids available</p>';
  }

  detailsContainer.appendChild(currentBidderContainer)


  // Bids section
  const toggleBidsButton = document.createElement("button");
  toggleBidsButton.id = `toggleBidsButton-${listing.id}`;
  toggleBidsButton.textContent = `ALL BIDS: ${listing.bids.length}`;
  toggleBidsButton.classList.add(
    "btn", 
    "text-center", 
    "btn-white", 
    "justify-content-center",
    "my-2",
    "px-5",
    "border",
    "border-2",
    "border-secondary"
  );

  const toggleBtnWrapper = document.createElement("div");
  toggleBtnWrapper.style.width = "100%";  
  toggleBtnWrapper.style.margin = "2px 0";    
  toggleBtnWrapper.classList.add(
    "d-flex", 
    "justify-content-center", 
    "align-items-center"
  );

  toggleBtnWrapper.appendChild(toggleBidsButton);

  const bidsContainer = document.createElement('div');
  bidsContainer.style.display = 'none'; 
  bidsContainer.style.width = "100%";
  bidsContainer.classList.add(
    'bidsContainer',
    "container-fluid",
    "text-center",
    "m-auto",
    "justify-content-center",
  );

  const bidsContent = document.createElement("div");
  bidsContent.classList.add("bidsContent");

  listing.bids.forEach(bid => {
    const bidItem = document.createElement("div");
    bidItem.classList.add("bidItem", "d-flex", "justify-content-between", "my-1", "border-bottom", "border-1");

    const bidderName = document.createElement("span");
    bidderName.textContent = bid.bidder.name || "Unknown";
    bidderName.classList.add("bidderName", "fs-6");

    const bidAmount = document.createElement("span");
    bidAmount.textContent = `$${bid.amount}`;
    bidAmount.classList.add("bidAmount", "fs-6");

    bidItem.appendChild(bidderName);
    bidItem.appendChild(bidAmount);
    bidsContent.appendChild(bidItem);
  });

  bidsContainer.appendChild(bidsContent);
  detailsContainer.appendChild(bidsContainer);

  toggleBidsButton.addEventListener("click", (e) => {
    e.stopPropagation();
    if (bidsContainer.style.display === 'none') {
      bidsContainer.style.display = 'block';
      toggleBidsButton.textContent = "Hide Bids";
    } else {
      bidsContainer.style.display = 'none';
      toggleBidsButton.textContent = `ALL BIDS: ${listing.bids.length}`;
    }
  });

  detailsContainer.appendChild(toggleBtnWrapper);
  
  
  // const countdownElement = document.createElement("p"); 
  // countdownElement.id = `countdown-${listing.id}`; 
  // countdownElement.classList.add( "countdown", "font-weight-bold", "text-danger", "fs-6" );


  // Appendings
  postCardContent.append(title, descriptionContainer, tagsContainer, createdDate, endTimeAndBidBtnContainer, detailsContainer);
  postCardContent.appendChild(detailsContainer);
  postCard.appendChild(imgContent);
  postCard.appendChild(postCardContent);
  postAllContent.appendChild(postContent);
  postAllContent.appendChild(postCard);
  postContainer.appendChild(postAllContent);

  setTimeout(() => countdown(listing.endsAt, `countdown-${listing.id}`, listing._count.bids, `bidBtn-${listing.id}`), 0);

  return postContainer;
}

