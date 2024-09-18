import { getListing, updateListing } from "../api/listings/index.mjs";
import { mediaAddBtn } from "./addMoreImg.mjs";

export async function setUpdateListingListener() {
    document.addEventListener("DOMContentLoaded", async () => {
        const form = document.querySelector("#editListing");

        if (!form) {
            console.error("Listing form not found");
            return;
        }

        const isUpdate = form.dataset.mode === 'update'; // Check if it's an update form
        if (isUpdate) {
            const url = new URL(location.href);
            const id = url.searchParams.get("listing"); // Ensure this matches your URL parameter

            if (!id) {
                console.error("No listing ID found in URL");
                return;
            }

            const button = form.querySelector("button[type='submit']");
            if (button) {
                button.disabled = true;

                try {
                    mediaAddBtn(); // Initialize media add functionality
                    const response = await getListing(id);
                    const listing = response.data; // Adjust based on actual response structure
                    console.log("Fetched listing data:", listing);

                    form.querySelector("#title").value = listing.title || "";
                    form.querySelector("#description").value = listing.description || "";

                    // Convert and set the endsAt value, but do not allow it to be edited
                    if (listing.endsAt) {
                        const endsAt = new Date(listing.endsAt);
                        const formattedEndsAt = `${endsAt.getFullYear()}-${String(endsAt.getMonth() + 1).padStart(2, '0')}-${String(endsAt.getDate()).padStart(2, '0')}T${String(endsAt.getHours()).padStart(2, '0')}:${String(endsAt.getMinutes()).padStart(2, '0')}`;
                        form.querySelector("#endsAt").value = formattedEndsAt;
                        form.querySelector("#endsAt").disabled = true; // Disable editing of endsAt
                    }

                    form.querySelector("#tags").value = listing.tags ? listing.tags.join(", ") : "";

                    // Handle existing media
                    const mediaContainer = form.querySelector("#media-container");
                    if (!mediaContainer) {
                        console.error("Media container not found");
                        return;
                    }

                    mediaContainer.innerHTML = "";
                    if (listing.media && listing.media.length > 0) {
                        listing.media.forEach(mediaItem => {
                            const mediaDiv = document.createElement("div");
                            mediaDiv.className = "media-item";
                            mediaDiv.classList.add("d-flex", "justify-content-between");
                            mediaDiv.style.height = "80px";

                            const input = document.createElement("input");
                            input.classList.add("w-100");
                            input.type = "text";
                            input.name = "media[]";
                            input.value = mediaItem.url || ""; // Assuming 'url' is the property in your media object

                            mediaDiv.appendChild(input);

                            if (mediaItem.url) {
                                const preview = document.createElement("img");
                                preview.src = mediaItem.url;
                                preview.alt = "Media preview";
                                preview.style.maxWidth = "100px"; // Optional: Limit image size
                                mediaDiv.appendChild(preview);
                            }

                            mediaContainer.appendChild(mediaDiv);
                        });
                    }
                } catch (error) {
                    console.error("Error fetching listing data:", error);
                    alert("Error loading listing data.");
                } finally {
                    button.disabled = false;
                }
            }

            form.addEventListener("submit", async (event) => {
                event.preventDefault();

                // Collect only editable fields
                const title = form.querySelector("#title").value.trim();
                const description = form.querySelector("#description").value.trim();
                const tags = (form.querySelector("#tags").value || "").split(",").map(tag => tag.trim());

                // Collect media URLs, allowing them to be edited
                const mediaInputs = Array.from(form.querySelectorAll("input[name='media[]']"));
                const media = mediaInputs.map(input => ({
                    url: input.value.trim(),
                    type: 'image' // Adjust if media type varies
                })).filter(mediaItem => mediaItem.url); // Filter out empty URLs if needed

                const listingData = {
                    title,
                    description,
                    tags,
                    media, // Include media in the update data
                };

                // Log the data for debugging
                console.log("Listing Data to be sent:", listingData);

                // Validate data
                if (!listingData.title || listingData.title.length < 3) {
                    alert("Title is required and must be at least 3 characters long.");
                    return;
                }
                if (!listingData.description || listingData.description.length < 8) {
                    alert("Description is required and must be at least 8 characters long.");
                    return;
                }

                try {
                    await updateListing(id, listingData);
                    alert("Listing updated successfully.");
                    window.location.href = "/feed/profile/";
                } catch (error) {
                    console.error("Error updating listing:", error);
                    alert("Failed to update the listing.");
                }
            });
        }
    });
}