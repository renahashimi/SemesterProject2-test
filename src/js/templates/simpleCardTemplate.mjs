export function simpleListingCard(listing) {
    const simpleListContainer = document.createElement("div");
    simpleListContainer.classList.add(
      "simpleListContainer", 
      "row", 
      "m-auto", 
      "justify-content-center",
      "bg-white",
      "p-2",
      "border",
      "border-2",
      "border-secondary",
      "rounded"
    );
  
    const postCard = document.createElement("div");
    postCard.style.flex = "1 1 300px";
    postCard.style.width = "80%";
    postCard.style.maxHeight = "100%";
    postCard.style.overflow = "hidden";
    postCard.style.flexShrink = "0";
    postCard.style.flexDirection = "column"; 
    postCard.style.alignItems = "center"; 
    postCard.style.justifyContent = "space-between"; 
    postCard.classList.add(
      "postCard", 
      "container-md", 
      "d-flex", 
      "rounded", 
      "bg-white",
      "my-2", 
      "m-auto",
      "p-1", 
    );
  
    const link = document.createElement("a");
    link.href = `/feed/listings/singleItem/?listing=${listing.id}`;
  
    simpleListContainer.appendChild(link);
  
    // Image
    if (listing.media && listing.media.length > 0) {
        if (listing.media.length === 1) {
            const img = document.createElement("img");
            img.src = listing.media[0].url;
            img.alt = listing.media[0].alt || "Listing image";
            img.style.width = "100%";
            img.style.height = "280px";
            img.style.objectFit = "cover";
            img.style.borderRadius = "5px";
            img.classList.add(
              "postcard-image",
              "m-auto",
              "border",
              "border-2",
              "border-tealgreen"
            );
            link.appendChild(img);
        } else {
            const scrollContainer = document.createElement("div");
            scrollContainer.style.display = "flex";
            scrollContainer.style.overflowX = "scroll";
            scrollContainer.style.width = "280px";
            scrollContainer.style.height = "280px";
            scrollContainer.classList.add("scrollbar-visible");
  
            listing.media.forEach((mediaItem) => {
                const img = document.createElement("img");
                img.src = mediaItem.url;
                img.alt = mediaItem.alt || "Listing image";
                img.style.height = "100%";
                img.style.flexShrink = "0";
                img.style.marginRight = "10px";
                img.style.borderRadius = "5px";
                img.style.objectFit = "cover";
                img.style.height = "280px";
                img.style.width = "280px";
                scrollContainer.appendChild(img);
            });
  
            link.appendChild(scrollContainer);
        }
    } else {
        // Use default image if no images are available
        const defaultImg = document.createElement("img");
        defaultImg.src = "/src/images/noimage.jpg"; // Path to the default image
        defaultImg.alt = "No image available";
        defaultImg.style.width = "280px";
        defaultImg.style.height = "280px";
        defaultImg.style.objectFit = "cover";
        defaultImg.style.borderRadius = "5px";
        defaultImg.classList.add(
          "postcard-image",
          "m-auto",
          "border",
          "border-2",
          "border-tealgreen"
        );
        link.appendChild(defaultImg);
    }
  
    const title = document.createElement("h2");
    title.style.marginTop = "5px";
    title.textContent = listing.title || "No title available";
    title.classList.add(
      "listingTitle", 
      "font-tenor", 
      "postcard-title", 
      "fs-6", 
      "py-2",
      "text-uppercase", 
      "text-primary",
      "text-center",
      "rounded-pill",
      "shadowBorder10"
    );
    link.appendChild(title);
  
    const viewButton = document.createElement("button");
    viewButton.classList.add(
        "btn",
        "btn-primary",
        "font-tenor",
        "fs-6",
        "w-75",
        "p-2",
        "text-center",
        "border",
        "border-2",
        "border-tealgreen",
        "rounded-pill"
    );
    viewButton.textContent = "GO TO LISTING";
    viewButton.style.width = "auto"; // Adjust width to auto for better centering
    viewButton.style.height = "50px"; // Define consistent height
    viewButton.style.margin = "10px auto"; // Center using margin
    viewButton.addEventListener("click", (e) => {
        e.stopPropagation();
        window.location.href = `/feed/listings/singleItem/?listing=${listing.id}`;
    });
  
    postCard.appendChild(link);
    postCard.appendChild(viewButton); // Append the button after the link
    simpleListContainer.appendChild(postCard);
  
    return simpleListContainer;
  }