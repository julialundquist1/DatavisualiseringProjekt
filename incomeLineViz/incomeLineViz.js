function renderIncomeLineViz () {
    const wSvg = 950;
    const hSvg = 670;
    const wViz = wSvg * 0.8;
    const hViz = hSvg * 0.7;
    const wPadding = (wSvg - wViz) / 2;
    const hPaddingTop = 50;

    let incomeData = [];

    for (let manager of Managers) {
        let name = manager.name;
        let id = manager.id;
        let djArray = DJs.filter(x => id == x.managerID);
        let numberOfDjs = djArray.length;
        let managerGigs = Gigs.filter(gig => djArray.some(dj => dj.id === gig.djID));

        let incomeObject = {
            name: name,
            id: id,
            years: []
        };

        for (let i = 2015; i <= 2024; i++) {
            let djIncome = 0;
            for (let gig of managerGigs) {
                let date = new Date (gig.date);
                let year = date.getFullYear();
                if (year == i) {
                    djIncome += gig.djEarnings;
                }
                
            }
            let averageIncome = djIncome / numberOfDjs;
            let incomePoint = {year: i, income: averageIncome};
            incomeObject.years.push(incomePoint);
        }

        incomeData.push(incomeObject);
    }

    let colorArray = ["#FE00B0", "#BB00FF", "#FF2D1F", "#055C00", "#0333ED", "#00FFFF", "#FFFB00", "#480892", "#2FFF00", "#FF7317"];
    let sortedManagers = incomeData.sort((a, b) => a.name.localeCompare(b.name));
    let sortedNames = sortedManagers.map(d => d.name);
    let colorScale = d3.scaleOrdinal()
        .domain(sortedNames)
        .range(colorArray);

    let allYears = incomeData[0].years.map(y => y.year);
    
    let maxIncome = incomeData[0].years[0].income;
    for (let income of incomeData) {
        for(let point of income.years) {
            maxIncome = Math.max(maxIncome, point.income);
        }
    }
    
    let incomeScale = d3.scaleLinear([0, maxIncome], [hPaddingTop + hViz, hPaddingTop]);
    let yearScale = d3.scalePoint(allYears, [wPadding, wPadding + wViz])
        .padding(0);

    let svg = d3.select("body")
        .append("svg")
        .attr("width", wSvg)
        .attr("height", hSvg)
        .style("background-color", "black");

    let xAxis = d3.axisBottom(yearScale);
    svg.append("g")
        .attr("transform", `translate(0, ${hViz + hPaddingTop})`)
        .call(xAxis)
        .selectAll("text")
        .attr("class", "incomeVizText")
        .attr("fill", "white"); 
        ;

    let yAxis = d3.axisLeft(incomeScale);
    svg.append("g")
        .attr("transform", `translate(${wPadding}, 0)`)
        .call(yAxis)
        .selectAll("text")
        .attr("class", "incomeVizText")
        .attr("fill", "white");

    svg.selectAll(".domain, .tick line")
        .attr("stroke", "white");

    const dMaker = d3.line()
        .x(d => yearScale(d.year))
        .y(d => incomeScale(d.income));
    
    svg.append("g")
        .selectAll("path")
        .data(incomeData)
        .enter()
        .append("path")
        .attr("stroke", d => colorScale(d.name))
        .attr("fill", "transparent")
        .attr("d", d => dMaker(d.years));

    incomeData.forEach((data) => {
        svg.append("g")
            .selectAll("rect")
            .data(data.years)
            .enter()
            .append("circle")
            .attr("fill", "white")
            .attr("cx", d => yearScale(d.year))
            .attr("cy", d => incomeScale(d.income))
            .attr("r", 5)
        ;
    });
    
    

}