import { openLoginOverlay } from './overlayUtils.mjs';
import { load } from '../storage/index.mjs';
import { getProfile } from '../api/profile/get.mjs';
import { profileTemplate } from '../templates/profileTemplate.mjs';
import { API_AUCTION_URL } from '../api/constants.mjs';
import { createListingCard } from '../templates/listingCardTemplate.mjs';
import { authFetch } from '../api/authFetch.mjs';
import { simpleListingCard } from '../templates/simpleCardTemplate.mjs';
import getWins from '../api/profile/wins.mjs';

const listingsAction = "/listings?_seller=true&_bids=true";
const winsAction = "/wins?_seller=true&_bids=true";

export async function renderMyProfile() {
    const token = load('token');
    const profile = load('profile');

    const profileContainer = document.getElementById('profileContainer');
    const myListingsContainer = document.getElementById('myListings');
    const myWinsContainer = document.getElementById('myWins');
    const userTitleElement = document.getElementById('userTitle');

    if (window.location.pathname === '/feed/profile/' && !token) {
        const myProfile = document.getElementById("myProfile")
        myProfile.style.display = "none";
        if (profileContainer) {
            profileContainer.innerHTML = `
                <div class="profile-alert fonyt-raleway align-items-center border-tealgreen text-center" style="max-width: 600px;" role="alert">
                    <h1 class="alert-heading font-raleway-900 fs-6 text-tealgreen text-uppercase">Whoa there, adventurer!</h1>
                    <p class="text-secondary">It seems you're not logged in. To see your profile and the magical wonders within, please log in using the overlay.</p>
                    <p class="text-secondary">Don't worry, logging in is easier than finding a needle in a haystack!</p>
                    <button id="profile-open-overlay-btn" class="m-auto text-center pt-3 border-0 font-tenor fs-4 text-uppercase bg-white">LOGIN</button>  
                </div>
            `;
            document.getElementById('profile-open-overlay-btn').addEventListener('click', openLoginOverlay);
        }
        return; 
    }

    try {
        const userName = profile.name || '';
        
        // Set the title with the user's name
        if (userTitleElement) {
            userTitleElement.textContent = `${userName.toUpperCase()}'S PROFILE - MIDAS TOUCH`;
        }

        // Fetch profile data
        const profileData = await getProfile(userName);
        console.log('Fetched PROFILE:', profileData);

        if (!profileContainer) {
            throw new Error('Profile container not found.');
        }

        const profileInfo = await profileTemplate(profileData);
        profileContainer.innerHTML = '';
        profileContainer.append(profileInfo);
        
        // Save credits to localStorage
        const credits = profileData.data?.credits;
        if (credits !== undefined) {
            localStorage.setItem('credits', credits);
        }

        // Fetch and render my listings
        if (myListingsContainer) {
            try {
                const listingsResponse = await authFetch(`${API_AUCTION_URL}/profiles/${userName}${listingsAction}`);
                if (!listingsResponse.ok) {
                    throw new Error(`Error fetching listings: ${listingsResponse.statusText}`);
                }

                const listingsData = await listingsResponse.json();
                const listings = listingsData.data; 
                console.log('Fetched Listings:', listings); 
        
                myListingsContainer.innerHTML = ''; 
        
                if (Array.isArray(listings) && listings.length > 0) {
                    listings.forEach((listing) => {
                        console.log('Listing object:', listing); 
                        const listingCard = createListingCard(listing, "my-listing");
            
                        const bidControls = listingCard.querySelector(`#bidControls-${listing.id}`);
                        if (bidControls) {
                            if (listing.seller?.name === userName) {
                                bidControls.style.display = "none";
                                bidControls.style.width = "100%";
                                bidControls.classList.add("pt-3", "p-0");
                                bidControls.innerHTML = `<p>"You own this! No bidding."</p>`;
                            } 
                        }
                        myListingsContainer.appendChild(listingCard);
                    });
                } else {
                    myListingsContainer.innerHTML = `
                    <div class="noListingTxt d-block text-center font-raleway-900 text-uppercase mt-5">
                        <h2 class="text-tenor fs-4">No listings yet?</h2>
                        <a class="text-tealgreen fs-6 mt-n5" href="/feed/listings/create/">Add your first listing here</a>
                    </div>`;
                }
            } catch (error) {
                console.error('Failed to load listings:', error);
                if (myListingsContainer) {
                    myListingsContainer.innerHTML = `
                    <div class="noListingTxt d-block text-center font-raleway-900 text-uppercase mt-5">
                        <h2 class="text-tenor fs-4">Error loading listings!</h2>
                        <p class="text-secondary">There was an error loading your listings. Please try again later.</p>
                    </div>`;
                }
            }
        }

        // Fetch and render won listings
        if (myWinsContainer) {
            try {
                const wonListingsData = await getWins(profile.name)
                console.log('Fetched Won Listings Data:', wonListingsData);        
                const wonListings = wonListingsData.data; 
                console.log('Won Listings:', wonListings);
        
                myWinsContainer.innerHTML = ''; 
                
                if (Array.isArray(wonListings) && wonListings.length > 0) {
                    wonListings.forEach((listing) => {
                        console.log('Won Listing object:', listing); 
                        const listingCard = simpleListingCard(listing);
                    
                        myWinsContainer.appendChild(listingCard);
                    });
                } else {
                    myWinsContainer.innerHTML = `
                    <div class="noListingTxt d-block text-center font-raleway-900 text-uppercase mt-5">
                        <h3 class="text-tenor fs-4">No wins yet?</h3>
                        <a class="text-tealgreen fs-6 mt-n5" href="/feed/listings/">Browse listings to place a bid</a>
                    </div>`;
                }
            } catch (error) {
                console.error('Failed to load won listings:', error);
                myWinsContainer.innerHTML = `
                <div class="noListingTxt d-block text-center font-raleway-900 text-uppercase mt-5">
                    <h3 class="text-tenor fs-4">Error loading wins!</h3>
                    <p class="text-secondary">There was an error loading your won listings. Please try again later.</p>
                </div>`;
            }
        }
    } catch (error) {
        console.error('Failed to load profile or listings:', error);
        if (profileContainer) {
            profileContainer.innerHTML = '<p>Failed to load profile. Please try again later.</p>';
        }
    }
}