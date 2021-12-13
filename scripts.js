

    let m = [-122.490402, 37.786453],
      q = [-122.389809, 31.72728],
      n = [-122.389809, 37.72728];
    let coordinates = [m, n, q];

    function loadMap(points) {
      let pathGenerator = null
      let geoJsonUrl = ''
      let aa = [-122.490402, 37.786453],
        bb = [-122.389809, 37.72728];
      let ds = [aa, bb];

      pathGenerator = d3.geoPath().projection(usaProjection)
      geoJsonUrl = "https://gist.githubusercontent.com/spiker830/e0d1b7950ced31369c903bed0cead7b1/raw/702c72e0ca5a1be95f84a50a58cfa6d4d6400f3f/us_features.json"

      d3.json(geoJsonUrl).then(geojson => {
        svg.selectAll("path")
          .data(geojson.features)
          .enter()
          .append("path")
          .attr("d", pathGenerator)
          .attr("stroke", "grey")
          .attr("fill", "white")
          .attr("class", "states")
      })
    }

    function updateMap() {
      let locs = svg.selectAll("circle").data(coordinates);
      locs.exit().remove();
      locs.enter().append("circle")
        .attr("cx", function (d) {
          if (usaProjection(d) != null) {
            return usaProjection(d)[0];
          }
          return aa[0];
        })
        .attr("cy", function (d) {
          if (usaProjection(d) != null) {
            return usaProjection(d)[1];
          }
          return aa[1];
        })
        .attr("r", "3px")
        .attr("fill", "red")
        .attr("class", "points")
    }

    let manufacturer = [],
      carYear = [],
      model = [],
      price = [],
      latitude = [],
      longitude = [],
      state = [],
      fullData = [],
      postingDate = [];


    function loadSlider() {
      let slider = document.getElementById("yearsRange");
      let output = document.getElementById("displayYear");
      output.innerHTML = slider.value;

      loadData();

      slider.oninput = function () {
        let selectedYear = this.value;
        coordinates = [];

        output.innerHTML = selectedYear;
        for (let i = 0; i < carYear.length; i++) {
          if (carYear[i] === selectedYear) {

            let point = [];

            point.push(parseInt(longitude[i], 10));
            point.push(parseInt(latitude[i], 10));
            coordinates.push(point);

          }
        }
        updateMap();

      }
    }

    function loadData() {

      d3.csv("./data/vehicles.csv").then(function (data) {

        fullData = data;
        data.map(function (d) {
          //fullData.push(d);
          manufacturer.push(d.manufacturer);
          carYear.push(d.year);
          model.push(d.model);
          price.push(d.price);
          latitude.push(d.lat);
          longitude.push(d.long);
          postingDate.push(d.posting_date);
          state.push(d.state);
        });
      });

    }

    let usaProjection = d3.geoAlbersUsa()
      .scale(850)
      .translate([550, 250]);
    let aa = [-85.48, 32.59],
      bb = [-122.389809, 37.72728];
    let ds = [aa, bb];
    let width = 900, height = 500;
    let svg = d3.select("#svg").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "mapusa")
    loadSlider();
    loadMap(ds);




    let vehicless = "./data/vehicless.csv";
    // loading data
    d3.csv(vehicless).then(mainn)



    function mainn(data) {
      const width = 900;
      const height = 450;
      const margin = { top: 50, bottom: 50, left: 50, right: 50 };
      const svg = d3.select('#d3-container')
        .append('svg')
        .attr('width', width - margin.left - margin.right)
        .attr('height', height - margin.top - margin.bottom)
        .attr("viewBox", [0, 0, width, height]);

      const x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1)

      const y = d3.scaleLinear()
        .domain([0, 100000])
        .range([height - margin.bottom, margin.top])

      svg
        .append("g")
        .attr("fill", 'darkred')
        .selectAll("rect")
        .data(data.sort((a, b) => d3.ascending(a.year, b.year)))
        .join("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d.price))
        .attr('title', (d) => d.price)
        .attr("class", "rect")
        .attr("height", d => y(0) - y(d.price))
        .attr("width", x.bandwidth());

      function yAxis(g) {
        g.attr("transform", `translate(${margin.left}, 0)`)
          .call(d3.axisLeft(y).ticks(null, data.format))
          .attr("font-size", '20px')
      }

      function xAxis(g) {
        g.attr("transform", `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(x).tickFormat(i => data[i].year))
          .attr("font-size", '20px')
      }

      svg.append("g").call(xAxis);
      svg.append("g").call(yAxis);
      svg.node();
    }
