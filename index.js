/**
 * Author: Simone Scardapane.
 * Simple demo for Codemotion Milano 2018.
 * Max computation of a fixed-length vector.
 */
 
 // Some general parameters
 const BATCH_SIZE = 32;
 const SEQ_LEN = 6;
 const LSTM_UNITS = 100;
 const EPOCHS = 1000;
 const model = tf.sequential();
 
 function createBatch() {
 // Generate a batch of BATCH_SIZE elements
	return tf.tidy(() => {
		const x = tf.randomUniform([BATCH_SIZE, SEQ_LEN, 1]);
		const y = tf.oneHot(tf.argMax(x, 1).squeeze(), SEQ_LEN);
		return [x, y];
	});
 }
 
 async function createModel() {
 // Add layers for our model
	model.add(
	  tf.layers.lstm({
		units: LSTM_UNITS,
		returnSequences: false,
		batchInputShape: [null, SEQ_LEN, 1],
		recurrentActivation: 'tanh'
	  })
	);
	model.add(tf.layers.batchNormalization());
	model.add(
	  tf.layers.dense({
		units: SEQ_LEN,
		activation: 'softmax'
	  })
	);
	  
	// Simplified Keras syntax
	model.compile({
		loss: 'categoricalCrossentropy',
		optimizer: 'adam',
		metrics: ['accuracy']
	});
	
 }
 
 async function trainEpoch(model){
 // Train for a single epoch
 
	// Generate a single batch of elements
	const data = createBatch();
			
	// Train the model for one iteration
	const history = await model.fit(data[0], data[1], {epochs: 1, batchSize: BATCH_SIZE});
	
	return tf.tidy(() => {
		// Update browser
		const oldTrainLoss = parseFloat(document.getElementById('accuracy').textContent.slice(0, -2)) / 100.0;
		const newTrainLoss = history.history['acc'][0];
		const trainLoss = Math.max(oldTrainLoss, newTrainLoss) * 100.0;
		document.getElementById('accuracy').textContent = trainLoss + ' %';
		
		// Return raw training loss
		return newTrainLoss
	});
	
 }
 
 async function train() {
 
	// Create the model
	await createModel();
	
	let losses = [];
	for (let i = 0; i < EPOCHS; ++i) {
		newLoss = await trainEpoch(model);
		document.getElementById('epoch').textContent = i + 1;
		losses.push(newLoss);
		await plotData('.plot', tf.range(0, i), losses);
		await tf.nextFrame();
	}
 }
 
 async function runDemo() {
	document.getElementById('trainModel').addEventListener('click', async () => {
		await train();
	});
	
	document.getElementById('testModel').addEventListener('click', async () => {
		const data = tf.randomUniform([1, SEQ_LEN, 1]);
		const prediction = await tf.argMax(model.predict(data), 1);
		
		document.getElementById('testInput').textContent = await data;
		document.getElementById('testOutput').textContent = data.dataSync()[prediction.dataSync()];
	});
}

plotData('.plot', tf.scalar(0.0), [0.0]);
runDemo();