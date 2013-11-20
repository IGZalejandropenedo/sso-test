var self = {},
	itemStore = [
	{
		name: 'Bragas de Esparto',
		description: 'Clasicas como el sandwich mixto.',
		url: 'http://farm4.static.flickr.com/3333/4559392495_e74437ed7d.jpg'
	},
	{
		name: 'Slip Espartano',
		description: 'Calzon de esparto para campo y playa.',
		url: 'http://calzoncillosdeesparto.internetized.net/imagenes/modelo-reforzado320.jpg'
	}
];

self.getAll = function() {
	return itemStore;
};

module.exports = self;

