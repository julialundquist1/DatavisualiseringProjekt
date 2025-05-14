function renderGUI () {
    let wrapper = document.getElementById("wrapper");
    wrapper.innerHTML = `
    <div id="backgroundContainer">
        <h1 id="titleText">RAVE LINQ</h1>
        <div id="contentContainer">
            <div id="infoBox">
                <h2>ARE YOU A DJ?</h2>
                <img id="ravePic" src="./media/images/ravePic.png">
                <p id="descriptionP">Here you can explore managers through powerful data visualizations that show exactly how they perform when it comes to income, audience demographics and where their artists are performing. Compare managers based on what matters most to you, and find the right fit with clarity and confidence.</p>
            </div>
            <div id="dividerBox">CONTINUE TO COMPARE MANAGERS</div>
            <div id="visualizationContainer">
                <h3 class="category">DJ Income Overview</h3>
                <p class="description">See the average yearly income each manager’s DJs generate, calculated per year the manager has been active. This ensures a fair comparison between managers, regardless of how long they've been in the industry. Curious about the trends? Click on any bar to explore how that manager’s average DJ income has evolved year by year.</p>
                <div id="firstViz"></div>
                <h3 class="category">Annual Gig Distribution</h3>
                <p class="description">Explore how active each manager has been in securing gigs for their DJs over the years. This heatmap uses color to reflect intensity: vibrant green signals high activity, vibrant pink indicates low activity, while lighter shades show moderate levels. Hover over a cell to see the average number of gigs per DJ for that year.</p>
                <div id="secondViz"></div>
                <h3 class="category">City Reach & Frequency</h3>
                <p class="description">This bubble chart shows how many unique cities each manager has booked gigs in and the average crowd size at those gigs. The size of each bubble represents how many DJs the manager works with, while color distinguishes each manager. Curious about a specific city? Use the dropdown to filter and see how many gigs each manager has secured there — and what the average attendance looked like.</p>
                <div id="thirdViz"></div>
            </div>
            <div id="footer"></div>
        </div>
    </div>
    `;
}