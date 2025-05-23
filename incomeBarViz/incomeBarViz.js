function renderIncomeBarViz () {
    const wSvg = 850;
    const hSvg = 600;
    const wViz = wSvg * 0.8;
    const hViz = hSvg * 0.7;
    const wPadding = (wSvg - wViz) / 2;
    const hPadding = 50;

    let incomeData = [];

    for (let manager of Managers) {
        let name = manager.name;
        let id = manager.id;
        let djArray = DJs.filter(x => id == x.managerID);
        let numberOfDjs = djArray.length;

        let managerGigs = Gigs.filter(gig => djArray.some(dj => dj.id === gig.djID));
        let gigsLastYears = managerGigs.filter(gig => {
            let year = new Date(gig.date).getFullYear();
            return year >= 2022 && year <= 2024;
        });

        let incomeLastYears = 0;
        for (let gig of gigsLastYears) {
            incomeLastYears += gig.djEarnings;
        }

        let gigDates = managerGigs.map(gig => new Date(gig.date));
        
        let earliest = gigDates[0];
        let latest = gigDates[0];

        for (let date of gigDates) {
            if (date < earliest) earliest = date;
            if (date > latest) latest = date;
        }

        let yearsActive = latest.getFullYear() - earliest.getFullYear() + 1;
        let djIncome = 0;
        for (let dj of djArray) {
            for (let gig of managerGigs) {
                if (gig.djID === dj.id) {
                    djIncome += gig.djEarnings;
                }
            }
        }
        let averageIncome = djIncome / (numberOfDjs * yearsActive);
        let avgIncomeLastYears = incomeLastYears / numberOfDjs;
        let chart = {name: name, id: id, djIncome: averageIncome, lastYearsIncome: avgIncomeLastYears};
        incomeData.push(chart);
    }
    
    let sortedIncomeData = incomeData.sort((a,b) => b.djIncome - a.djIncome);
    let managerNames = sortedIncomeData.map(x => x.name);
    
    let colorArray = ["#FE00B0", "#BB00FF", "#FF2D1F", "#055C00", "#0333ED", "#00FFFF", "#FFFB00", "#480892", "#2FFF00", "#FF7317"];

    let maxIncome = incomeData[0].djIncome;
    for (let income of incomeData) {
        maxIncome = Math.max(maxIncome, income.djIncome);
    }

    let incomeScale = d3.scaleLinear([0, maxIncome], [hPadding + hViz, hPadding]);
    let heightScale = d3.scaleLinear([0, maxIncome], [0, hViz]);
    let managerScale = d3.scaleBand(managerNames, [wPadding, wPadding + wViz]).paddingInner(0.4).paddingOuter(0.4);
    
    let svg = d3.select("#firstViz")
        .append("svg")
        .attr("width", wSvg)
        .attr("height", hSvg)
        .style("background-color", "black");

    svg.append("g")
        .selectAll("rect")
        .data(sortedIncomeData)
        .enter()
        .append("rect")
        .attr("width", managerScale.bandwidth)
        .attr("height", (d, i, nodes) => heightScale(d.djIncome))
        .attr("x", (d, i, nodes) => managerScale(d.name))
        .attr("y", (d, i, nodes) => incomeScale(d.djIncome))
        .attr("fill", (d, i, nodes) => colorArray[i]);

    svg.append("g")
        .selectAll(".label")
        .data(sortedIncomeData)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => managerScale(d.name) + managerScale.bandwidth() / 2)
        .attr("y", d => incomeScale(d.djIncome) - 20)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text(d => d.lastYearsIncome.toFixed(0));
        
    svg.append("g")
        .selectAll(".label-line")
        .data(sortedIncomeData)
        .enter()
        .append("line")
        .attr("class", "label-line")
        .attr("x1", d => managerScale(d.name) + managerScale.bandwidth() / 2)
        .attr("x2", d => managerScale(d.name) + managerScale.bandwidth() / 2)
        .attr("y1", d => incomeScale(d.djIncome))
        .attr("y2", d => incomeScale(d.djIncome) - 15)
        .attr("stroke", "white")
        .attr("stroke-width", 1);

    let xAxis = d3.axisBottom(managerScale);
    svg.append("g")
        .attr("transform", `translate(0, ${hViz + hPadding})`)
        .call(xAxis)
        .selectAll("text")
        .attr("class", "incomeVizText")
        .attr("fill", "white")
        .attr("transform", "rotate(-40)") 
        .style("text-anchor", "end")      
        .attr("x", -10)                   
        .attr("y", 10); 
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

    svg.append("text")
        .attr("class", "incomeP")
        .attr("x", wPadding - 30)             
        .attr("y", hPadding - 40)             
        .attr("fill", "white")
        .text("Income");

    svg.append("text")
        .attr("class", "incomeP")
        .attr("x", wPadding + wViz / 2)
        .attr("y", hPadding + hViz + 120)     
        .attr("text-anchor", "middle")        
        .attr("fill", "white")
        .text("Managers");
}


    

    
  
    




