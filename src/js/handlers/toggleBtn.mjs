// Function to toggle bids section visibility
export function toggleBidsVisibility(listingId) {
    const bidsContainer = document.querySelector(`#bidsContainer-${listingId}`);
    
    if (bidsContainer) {
        if (bidsContainer.classList.contains('d-none')) {
            bidsContainer.classList.remove('d-none');
        } else {
            bidsContainer.classList.add('d-none');
        }
    }
}