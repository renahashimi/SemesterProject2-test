export function handlePageLoad() {
    const spinner = document.getElementById('spinner');
    const userProfile = document.getElementById('userProfile');
    const myProfile = document.getElementById('myProfile');
    const goBackHistory = document.getElementById('goBackHistory');

    if (spinner) {
        spinner.style.display = 'none'; 
    } 
    if (userProfile) {
        userProfile.style.display = 'block'; 
    } 
    if (myProfile) {
        myProfile.style.display = 'block'; 
    }
    if (goBackHistory) {
        goBackHistory.style.display = 'block'; 
    }
}



// export function handlePageLoad() {
    
// window.addEventListener('load', () => {
//     document.getElementById('spinner').style.display = 'none';
//     document.getElementById('userProfile').style.display = 'block';
// });
// }
