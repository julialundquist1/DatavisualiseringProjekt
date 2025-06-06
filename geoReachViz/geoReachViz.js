let cityData = [];
let svg;
let gigScale;
let heightScale;
let managerScale;
let colorArray = ["#FE00B0", "#BB00FF", "#FF2D1F", "#055C00", "#0333ED", "#00FFFF", "#FFFB00", "#480892", "#2FFF00", "#FF7317"];

function renderGeoReachViz() {
    const wSvg = 850;
    const hSvg = 600;
    const wViz = wSvg * 0.8;
    const hViz = hSvg * 0.7;
    const wPadding = (wSvg - wViz) / 2;
    const hPadding = 50;

    for (let manager of Managers) {
        let name = manager.name;
        let id = manager.id;
        let djArray = DJs.filter(x => id == x.managerID);
        let managerGigs = Gigs.filter(gig => djArray.map(dj => dj.id).includes(gig.djID));

        let managerObject = {
            name: name,
            id: id,
            cities: []
        };

        for (let city of Cities) {
            let numOfTimes = 0;
            for (let gig of managerGigs) {
                if (city.id == gig.cityID) {

                    numOfTimes++;
                }
            }
            let cityObject = { city: city.name, cityID: city.id, numberOfTimes: numOfTimes };
            managerObject.cities.push(cityObject);
        }
        cityData.push(managerObject);
    }

    let maxNumOfTimes = cityData[0].cities[0].numberOfTimes;
    for (let object of cityData) {
        for (let city of object.cities) {
            maxNumOfTimes = Math.max(maxNumOfTimes, city.numberOfTimes);
        }
    }

    let managers = cityData.map(x => x.name);

    gigScale = d3.scaleLinear([0, maxNumOfTimes], [hPadding + hViz, hPadding]);
    heightScale = d3.scaleLinear([0, maxNumOfTimes], [0, hViz]);
    managerScale = d3.scaleBand(managers, [wPadding, wPadding + wViz]).paddingInner(0.4).paddingOuter(0.4);

    svg = d3.select("#fourthViz")
        .append("svg")
        .attr("width", wSvg)
        .attr("height", hSvg)
        .style("background-color", "black");
    
    let xAxis = d3.axisBottom(managerScale);
    svg.append("g")
        .attr("transform", `translate(0, ${hViz + hPadding})`)
        .call(xAxis)
        .selectAll("text")
        .attr("class", "cityText")
        .attr("fill", "white")
        .attr("transform", "rotate(-40)") 
        .style("text-anchor", "end")      
        .attr("x", -10)                   
        .attr("y", 10);
   
    let yAxis = d3.axisLeft(gigScale).ticks(6);
    svg.append("g")
        .attr("transform", `translate(${wPadding}, 0)`)
        .call(yAxis)
        .selectAll("text")
        .attr("class", "cityText")
        .attr("fill", "white");
    
    svg.selectAll(".domain, .tick line")
        .attr("stroke", "white");

    let select = d3.select("#dropDownContainer").append("select")
        .attr("id", "dropDownCity");
    
    svg.append("text")
        .attr("class", "cityP")
        .attr("x", wPadding - 30)             
        .attr("y", hPadding - 20)             
        .attr("fill", "white")
        .text("Number of gigs");

    svg.append("text")
        .attr("class", "cityP")
        .attr("x", wPadding + wViz / 2)
        .attr("y", hPadding + hViz + 120)     
        .attr("text-anchor", "middle")        
        .attr("fill", "white")
        .text("Managers");   
    
    select.selectAll("option")
        .data(Cities)
        .enter()
        .append("option")
        .attr("value", d => d.id)
        .text(d => d.name);
    
    updateBarChart(Cities[0].id);
    
    d3.select("#dropDownCity").on("change", function() {
        const selectedCityID = this.value;
        updateBarChart(selectedCityID);
        });
}

function updateBarChart(cityID) {
    d3.selectAll(".bars").remove();
    let index = 0;
    for (let manager of cityData) {
        let currentCity = manager.cities.find(x => x.cityID == cityID);

        svg.append("rect")
            .attr("class", "bars")
            .attr("width", managerScale.bandwidth)
            .attr("height", heightScale(currentCity.numberOfTimes))
            .attr("x", managerScale(manager.name))
            .attr("y", gigScale(currentCity.numberOfTimes))
            .attr("fill", colorArray[index]);

        index++;
    }
}






