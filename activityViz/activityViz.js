function renderActivityViz () {
    const wSvg = 950;
    const hSvg = 700;
    const wViz = wSvg * 0.8;
    const hViz = hSvg * 0.7;
    const wPadding = (wSvg - wViz) / 2;
    const hPaddingTop = 50;

    let actitivtyData = [];

    for (let manager of Managers) {
        let name = manager.name;
        let id = manager.id;
        let djArray = DJs.filter(x => id == x.managerID);
        let numberOfDjs = djArray.length;
        let managerGigs = Gigs.filter(gig => djArray.map(dj => dj.id).includes(gig.djID));

        let activityObject = {
            name: name,
            id: id,
            years: []
        };

        for (let i = 2015; i <= 2024; i++) {
            let numOfGigs = 0;
            for (let gig of managerGigs) {
                let date = new Date(gig.date);
                let year = date.getFullYear();
                if (year == i) {
                    numOfGigs ++;
                }

            }
            let averageNumberOfGigs = numOfGigs / numberOfDjs;
            let activityBar = { year: i, gigs: averageNumberOfGigs };
            activityObject.years.push(activityBar);
        }

        actitivtyData.push(activityObject);
    }

    let minGigs = actitivtyData[0].years[0].gigs;
    let maxGigs = actitivtyData[0].years[0].gigs;
    for (let activity of actitivtyData) {
        for (let year of activity.years) {
            minGigs = Math.min(minGigs, year.gigs);
            maxGigs = Math.max(maxGigs, year.gigs);
        }
    }

    let gigData = [];
    for (let manager of actitivtyData) {
        for (let year of manager.years) {
            gigData.push({
                name: manager.name,
                year: year.year,
                gigs: year.gigs
            });
        }
    }

    let allYears = actitivtyData[0].years.map(y => y.year);
    let allNames = actitivtyData.map(x => x.name);

    let yearScale = d3.scaleBand(allYears, [hPaddingTop + hViz, hPaddingTop]);
    let managerScale = d3.scaleBand(allNames, [wPadding, wPadding + wViz]);

    let svg = d3.select("#thirdViz")
        .append("svg")
        .attr("width", wSvg)
        .attr("height", hSvg)
        .style("background-color", "black");
    
    let xAxis = d3.axisBottom(managerScale);
    svg.append("g")
        .attr("transform", `translate(0, ${hViz + hPaddingTop})`)
        .call(xAxis)
        .selectAll("text")
        .attr("class", "activityText")
        .attr("fill", "white")
        .attr("transform", "rotate(-90)") 
        .style("text-anchor", "end")      
        .attr("x", -15)                   
        .attr("y", -5)
        ;
    
    let yAxis = d3.axisLeft(yearScale);
    svg.append("g")
        .attr("transform", `translate(${wPadding}, 0)`)
        .call(yAxis)
        .selectAll("text")
        .attr("class", "activityText")
        .attr("fill", "white");

    svg.selectAll(".domain").remove();
    svg.selectAll(".tick line").remove();

    svg.append("text")
        .attr("class", "activityP")
        .attr("x", wPadding - 30)
        .attr("y", hPaddingTop - 20)
        .attr("fill", "white")
        .text("Years");

    svg.append("text")
        .attr("class", "activityP")
        .attr("x", wPadding + wViz / 2)
        .attr("y", hPaddingTop + hViz + 130)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text("Managers");
    
    let groupViz = svg.append("g")
        .selectAll("rect")
        .data(gigData)
        .enter()
        .append("rect")
        .attr("width", managerScale.bandwidth)
        .attr("height", yearScale.bandwidth)
        .attr("x", (d, i, nodes) => managerScale(d.name))
        .attr("y", (d, i, nodes) => yearScale(d.year))
        .attr("fill", d => decideColors(d.gigs))
        .attr("stroke", "black")
        .on("mouseover", (event, d) => {
            tooltip
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 20) + "px")
              .style("opacity", 1)
              .html(`${d.name}<br>Year: ${d.year}<br>Average gigs: ${Math.round(d.gigs)}`);
          })
        .on("mouseout", () => {
            tooltip.style("opacity", 0);
          })
        ;

    let tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("padding", "10px")
        .style("border-radius", "4px")
        .style("opacity", 0);
    
}

function decideColors(gigs) {
    let colorArray = ["#C3FFB5", "#7EFE7B", "#15FF00", "#07C900"];
    if (gigs >= 0 && gigs <= 13) {
        return colorArray[0];
    } else if (gigs > 13 && gigs <= 26) {
        return colorArray[1];
    } else if (gigs > 26 && gigs <= 39) {
        return colorArray[2];
    } else if (gigs > 39 && gigs <= 52 ) {
        return colorArray[3];
    }
}