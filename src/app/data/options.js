export const temporals = [  
	{ label: 'Bimonthly', value: 'bimonthly' },
	{ label: 'Bimonthly multi-year', value: 'bimonthly-year' },
	{ label: '1-year', value: 'year' },
	{ label: 'Multi-year', value: 'multi-year' }
];

export const months = ['Jan-Feb', 'Mar-Apr', 'May-Jun', 'Jul-Aug', 'Sep-Oct', 'Nov-Dec'].map((feat, index) => new Object({ label: feat, value: index + 1 }));

export const years = [2019, 2020, 2021, 2022, 2023].map((feat, index) => new Object({ label: String(feat), value: feat }));

export const bands = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12'].map(feat => new Object({ label: feat, value: feat }));