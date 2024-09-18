import { simpleListingCard } from "../templates/simpleCardTemplate.mjs";
import { fetchListings } from "./renderListings.mjs";

// HOMEPAGE LISTING 
export async function renderSwitchListings() {
  const containerHomePage = document.getElementById('homePageContainer');

  if (!containerHomePage) {
    console.error('Container element not found.');
    return;
  }

  containerHomePage.innerHTML = ''; // Clear any existing content

  // Fetch listings
  const listings = await fetchListings();
  if (listings.length > 0) {
    displayAndSwitchListings(listings);  // Call the switch function to cycle through listings
  } else {
    containerHomePage.innerHTML = '<p>No listings available.</p>';  // Fallback if no listings are available
  }
}

// Function to display and switch listings on the homepage
let switchInterval;
export function displayAndSwitchListings(listings) {
  const containerHomePage = document.getElementById('homePageContainer');
  let currentIndex = 0;

  if (switchInterval) {
    clearInterval(switchInterval);  // Clear any previous interval to avoid multiple switches
  }

  // Function to display a set of 2 listings
  function showListings() {
    containerHomePage.innerHTML = '';  // Clear current listings

    const startIndex = currentIndex;
    const endIndex = (currentIndex + 2) % listings.length;  // Display 2 listings at a time

    // Create and append listing cards
    if (Array.isArray(listings) && listings.length > 0) {
      for (let i = startIndex; i < startIndex + 2; i++) {
        const index = i % listings.length;  // Ensure index wraps around
        const listingCard = simpleListingCard(listings[index]);
        if (listingCard) {
          containerHomePage.appendChild(listingCard);  // Append listing card to the homepage container
        } else {
          console.error('Failed to create listing card.');
        }
      }
    } else {
      console.error('No listings available.');
    }
  }

  // Initial display
  showListings();

  // Switch listings every 6 seconds
  switchInterval = setInterval(() => {
    currentIndex = (currentIndex + 2) % listings.length;  // Move to the next set of 2 listings
    showListings();
  }, 6000);  // Switch every 6 seconds
}
