d3.csv("crash.csv", function(d) {
    return {
        kmSemaine: +d.avail_seat_km_per_week,
        accidents85: +d.incidents_85_99,
        accidentsMortels85: +d.fatal_accidents_85_99,
        morts85: +d.fatalities_85_99,
        accidents00: +d.incidents_00_14,
        accidentsMortels00: +d.fatal_accidents_00_14,
        morts00: +d.fatalities_00_14,
        compagnie: d.airline,
        continent: d.continent
    };
}, function(data) {
    let largeur = window.innerWidth / 2;
    let hauteur = window.innerHeight / 2;
    let abs = "kmSemaine";
    let ord = "morts";
    let periodeTemp = 0;
    let compagnieChoisie = "Air France";
    let compteurTexte = -1;
    let marges = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    };

    //On ajoute toutes les compagnies au drop down correspondant
    data.forEach(function(d) {
        d3.select("#SelectCompagnie")
            .append("option")
            .attr("value", d.compagnie)
            .text(d.compagnie);
    });

    //On additionne les deux périodes
    data.map(function(d) {
        d.accidents = d.accidents85 + d.accidents00;
        d.accidentsMortels = d.accidentsMortels85 + d.accidentsMortels00;
        d.morts = d.morts85 + d.morts00;
    })

    //Initialisation du canevas
    let svg = d3.select("#canevas")
        .attr("width", largeur + marges.left + marges.right)
        .attr("height", hauteur + marges.left + marges.right)
        .append("g")
        .attr("transform", "translate(" + marges.left + "," + marges.top + ")");

    let choixPeriode = [{
            "kmSemaine": "kmSemaine",
            "accidents": "accidents85",
            "accidentsMortels": "accidentsMortels85",
            "morts": "morts85"
        },
        {
            "kmSemaine": "kmSemaine",
            "accidents": "accidents",
            "accidentsMortels": "accidentsMortels",
            "morts": "morts"
        },
        {
            "kmSemaine": "kmSemaine",
            "accidents": "accidents00",
            "accidentsMortels": "accidentsMortels00",
            "morts": "morts00"
        }
    ];

    let compagniesNest = d3.nest()
        .key(function(d) {
            return d.compagnie;
        })
        .map(data);


    //Création du tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class","tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    //Ajout du texte
    svg.append("g")
        .attr("class", "infoMoy")
        .append("text")
        .attr("id", "infoMoy");

    function graphe() {

        var x = choixPeriode[periodeTemp][abs];
        var y = choixPeriode[periodeTemp][ord];
        var yMoy = Math.round(d3.mean(data, d => d[y]));

        //Régression linéaire
        var lr = {};
        var n = data.length;
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var sum_yy = 0;
        var max = d3.max(data, d => d[x]);

        for (var i = 0; i < data.length; i++) {
            sum_x += data[i][x];
            sum_y += data[i][y];
            sum_xy += (data[i][x] * data[i][y]);
            sum_xx += (data[i][x] * data[i][x]);
            sum_yy += (data[i][y] * data[i][y]);
        }

        lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
        lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
        lr['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) /
            Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);

        /*
        Au début compteurTexte vaut -1. On lance graphe(), il passe à 0.
        Donc le texte ne change pas la première fois qu'on arrive sur la page.
        */
        compteurTexte++;
        if (compteurTexte != 0) {
            compagnieHTML = "$" + compagnieChoisie;
            document.getElementById("texte")
                .innerHTML = `<b>${compagnieChoisie}</b><ul>
				<li><small>Accidents totaux : ${compagniesNest[compagnieHTML][0].accidents}</small></li>
				<li><small>Accidents mortels totaux : ${compagniesNest[compagnieHTML][0].accidentsMortels}</small></li>
				<li><small>Morts totales : ${compagniesNest[compagnieHTML][0].morts}</small></li></ul> `;
        }

        //Initialisation des échelles
        var echelleX = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[x])])
            .range([marges.left, largeur - marges.right]);

        var echelleY = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[y])])
            .range([hauteur - marges.bottom, marges.top]);

        //Initialisation des axes
        let axeX = d3.axisBottom(echelleX);
        let axeY = d3.axisLeft(echelleY);

        //La première fois que la fonction graphe est lancée, on append les axes
        if (compteurTexte==0){
        svg.append("g")
        .attr("transform", `translate(0,${hauteur-marges.bottom})`)
        .attr("class", "axe")
        .attr("id","axeHorizontal")
        .call(axeX.tickFormat(function(number) {
            if( number > 999) return d3.format(".0s")
            else return d3.format("");
        }));
    
        svg.append("g")
        .attr("transform",`translate(${marges.left},0)`)
        .attr("class","axe")
        .attr("id","axeVertical")
        .call(axeY.tickFormat(function(number) {
            if( number > 999) return d3.format(".0s")
            else return d3.format("");
        }));}

        //La deuxième fois, on fait juste une transition
        else{
        svg.select("#axeHorizontal").transition()
        .duration(500)
        .call(axeX.tickFormat(function(number) {
            if( number > 999) return d3.format(".0s")
            else return d3.format("");        }));
    
        svg.select("#axeVertical").transition()
        .duration(500)
        .call(axeY.tickFormat(function(number) {
            if( number > 999) return d3.format(".0s")
            else return d3.format("");        }));}

        //Initialisation des variables pour les différents éléments
        var cercles = svg.selectAll("circle").data(data);
        var ligneReg = svg.selectAll(".ligneReg").data(data);
        var ligneMoy = svg.selectAll(".ligneMoy").data(data);
        
        //Ajout des cercles sur le canevas
        cercles.enter()
            .append("circle")
            .attr("cx", d => echelleX(d[x]))
            .attr("cy", d => echelleY(d[y]))
            .attr("r", 0)
            .attr("fill", "grey")
            .attr("opacity", 0);

        cercles.transition()
            .duration(500)
            .attr("cx", d => echelleX(d[x]))
            .attr("cy", d => echelleY(d[y]))
            .attr("r", 2.5)
            .attr("fill", function(d) {
                if (d.compagnie === compagnieChoisie) return "red";
                else return "grey";
            })
            .attr("opacity", 1);

        cercles.exit().remove();

        //Tooltips sur les cercles
        cercles.on("mouseover", function(d) {
            return tooltip
                .style("visibility", "visible")
                .text(d.compagnie);
        })
        cercles.on("mousemove", function(d) {
            return tooltip.style("top",
                (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
        })
        cercles.on("mouseout", function(d) {
            return tooltip.style("visibility", "hidden");
        });

        //On rajoute la régression, au début elle est blanche et on la voit pas
        ligneReg.enter()
            .append("line")
            .attr("class", "ligneReg")
            .attr("x1", echelleX(0))
            .attr("y1", echelleY(lr['intercept']))
            .attr("x2", echelleX(max))
            .attr("y2", echelleY((max * lr['slope']) + lr['intercept']))
            .style("stroke", "rgb(255,255,255)");

        ligneReg.transition()
            .duration(500)
            .attr("x1", echelleX(0))
            .attr("y1", echelleY(lr['intercept']))
            .attr("x2", echelleX(max))
            .attr("y2", echelleY((max * lr['slope']) + lr['intercept']))
            .style("stroke", "#eaaa07");

        //On ajoute la moyenne, au début elle est blanche et on la voit pas
        ligneMoy.enter()
            .append("line")
            .attr("class", "ligneMoy")
            .attr("x1", marges.left)
            .attr("y1", echelleY(yMoy))
            .attr("x2", largeur - marges.right)
            .attr("y2", echelleY(yMoy))
            .style("stroke", "rgb(255,255,255)")
            .style("stroke-dasharray", ("3, 3"))
            .style("stroke-width", 1);

        ligneMoy.transition()
            .duration(500)
            .attr("x1", marges.left)
            .attr("y1", echelleY(yMoy))
            .attr("x2", largeur - marges.right)
            .attr("y2", echelleY(yMoy))
            .style("stroke", "rgb(131, 161, 198)");

        ligneMoy.exit().remove();

        if (compteurTexte != 0) {
            d3.select("#infoMoy").text("Moyenne : " + yMoy);
        }
    }

    //Ajout des fonctions liées aux drop downs
    document.getElementById("SelectAxeHorizontal")
        .addEventListener("change", function() {
            abs = document.getElementById("SelectAxeHorizontal").value;
            graphe();
        });

    document.getElementById("SelectAxeVertical")
        .addEventListener("change", function() {
            ord = document.getElementById("SelectAxeVertical").value;
            graphe();
        });

    document.getElementById("SelectPeriodeTemp")
        .addEventListener("change", function() {
            periodeTemp = document.getElementById("SelectPeriodeTemp").value;
            graphe();
        });

    document.getElementById("SelectCompagnie")
        .addEventListener("change", function() {
            compagnieChoisie = document.getElementById("SelectCompagnie").value;
            graphe();
        });

    //On lance directement la fonction graphe en arrivant
    graphe();
});