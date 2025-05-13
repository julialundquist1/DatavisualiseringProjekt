function renderIncomeBarViz () {
    const wSvg = 990;
    const hSvg = 690;
    const wViz = wSvg * 0.8;
    const hViz = hSvg * 0.7;
    const wPadding = (wSvg - wViz) / 2;
    const hPadding = (hSvg - hViz) / 2;

    let incomeData = [];

    for (let manager of Managers) {
        let name = manager.name;
        let id = manager.id;
        let djArray = DJs.filter(x => id == x.managerID);
        let numberOfDjs = djArray.length;
        let djIncome = 0;
        for (let dj of djArray) {
            for (let gig of Gigs) {
                if (gig.djID === dj.id) {
                    djIncome += gig.djEarnings;
                }
            }
        }
        let averageIncome = djIncome / numberOfDjs;
        let chart = {name: name, id: id, djIncome: averageIncome, numOfDjs: numberOfDjs};
        incomeData.push(chart);
    }
    
    let maxIncome = incomeData[0].djIncome;
    let minIncome = incomeData[0].djIncome;
    for (let income of incomeData) {
        maxIncome = Math.max(maxIncome, income.djIncome);
        minIncome = Math.min(minIncome, income.djIncome);
    }

    console.log(maxIncome);
    console.log(minIncome);
    
    

    
  
    




}