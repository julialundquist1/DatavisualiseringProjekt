function renderIncomeLineViz() {
    const wSvg = 950;
    const hSvg = 600;
    const wViz = wSvg * 0.8;
    const hViz = hSvg * 0.8;
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
                let date = new Date(gig.date);
                let year = date.getFullYear();
                if (year == i) {
                    djIncome += gig.djEarnings;
                }

            }
            let averageIncome = djIncome / numberOfDjs;
            let incomePoint = { year: i, income: averageIncome };
            incomeObject.years.push(incomePoint);
        }

        incomeData.push(incomeObject);
    }

    let colorArray = ["#00FFFF", "#FF7317", "#FF2D1F", "#BB00FF", "#480892", "#FFFB00", "#055C00", "#0333ED", "#2FFF00", "#FE00B0"];
    let allYears = incomeData[0].years.map(y => y.year);

    let maxIncome = incomeData[0].years[0].income;
    for (let income of incomeData) {
        for (let point of income.years) {
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
        .attr("id", d => `line_${d.id}`)
        .attr("class", "incomeLine")
        .attr("stroke", (d, i, nodes) => colorArray[i])
        .attr("fill", "transparent")
        .attr("d", d => dMaker(d.years));

    incomeData.forEach((data, index) => {
        svg.append("g")
            .selectAll("rect")
            .data(data.years)
            .enter()
            .append("circle")
            .attr("id", d => `circle_${data.id}`)
            .attr("fill", colorArray[index])
            .attr("cx", d => yearScale(d.year))
            .attr("cy", d => incomeScale(d.income))
            .attr("r", 5)
            .on("mouseover", (event, d) => {
                tooltip
                  .style("left", (event.pageX + 10) + "px")
                  .style("top", (event.pageY - 20) + "px")
                  .style("opacity", 1)
                  .html(`Manager: ${data.name}<br>Year: ${d.year}<br>Income: ${Math.round(d.income)} kr`);
              })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
              })
            ;
    });

    let tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("padding", "6px")
        .style("border-radius", "4px")
        .style("opacity", 0);

    svg.append("text")
        .attr("class", "incomeP")
        .attr("x", wPadding - 30)
        .attr("y", hPaddingTop - 20)
        .attr("fill", "white")
        .text("Income");

    svg.append("text")
        .attr("class", "incomeP")
        .attr("x", wPadding + wViz / 2)
        .attr("y", hPaddingTop + hViz + 60)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text("Years");


    let activeLines = [];
    d3.select("body").append("div")
        .selectAll("div")
        .data(incomeData)
        .enter()
        .append("button")
        .text(d => d.name)
        .on("click", (event, d) => {
            const lineId = `line_${d.id}`;
            const circleId = `circle_${d.id}`;

            const isActive = activeLines.includes(d.id);

            if (isActive) {
                activeLines = activeLines.filter(id => id !== d.id);
                event.target.classList.remove("active");
            } else {
                activeLines.push(d.id);
                event.target.classList.add("active");
            }

            if (activeLines.length === 0) {
                d3.selectAll(".incomeLine").attr("visibility", "visible");
                d3.selectAll("circle").attr("visibility", "visible");
            } else {
                d3.selectAll(".incomeLine").attr("visibility", "hidden");
                d3.selectAll("circle").attr("visibility", "hidden");
                activeLines.forEach(id => {
                    d3.select(`#line_${id}`).attr("visibility", "visible");
                    d3.selectAll(`#circle_${id}`).attr("visibility", "visible");
                });
            }
        });
}




