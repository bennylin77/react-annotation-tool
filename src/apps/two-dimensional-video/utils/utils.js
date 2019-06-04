const getAnnotationIdByLabel = (label, annotations, entities) => (annotations.find(ann => entities.annotations[ann].label === label));

const getSubAnnotations = (i, annotations, entities) => {
	const result = [];
	const queue = [];
	const id = getAnnotationIdByLabel(`${i}`, annotations, entities);
	if (id) {
		queue.push(id);
		result.push(id);
	}
	while (queue.length > 0) {
		const ann = queue.shift();
		for (const c of entities.annotations[ann].children) {
			result.push(c);
			queue.push(c);
		}
	}
	return result;
};

const getSortedAnnotationsByLabel = (annotations, entities) => {
	let sortedAnnotations = [];
	let i = 1;
	while (sortedAnnotations.length < annotations.length && i <= annotations.length) {
		const subAnnotations = getSubAnnotations(i, annotations, entities);
		sortedAnnotations = subAnnotations.concat(sortedAnnotations);
		i += 1;
	}
	return sortedAnnotations;
};


export {
	getSortedAnnotationsByLabel,
};
