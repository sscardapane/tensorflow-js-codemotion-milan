
 async function plotData(container, xs, ys) {
   
   const xvals = await xs.data();
   const values = Array.from(ys).map((y, i) => {
     return {'x': xvals[i], 'y': ys[i]};
   });

   const spec = {
     'width': 600,
     'height': 200,
     'data': {'values': values},
     'mark': 'line',
     'encoding': {
       'x': {'field': 'x', 'type': 'quantitative', title: "Epoch"},
       'y': {'field': 'y', 'type': 'quantitative', title: "Accuracy"}
     },
	 "config": {
		 'axis': {
			'labelFontSize': 32,
			'titleFontSize': 32,
		}
	}
   };

   return vegaEmbed(container, spec, {actions: false});
 }