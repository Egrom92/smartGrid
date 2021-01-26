module.exports = {
	columns: 12,
	offset: "24px", //Межколонник
	container: {
        maxWidth: "1152px",
        fields: "30px" //Отступ по краю контейнера
    },
	breakPoints: {
		lg: {
            width: "1212px"
        },
		md: {
            width: "1020px",
            fields: "20px",
            offset: "18px"
        },
        sm: {
            width: "688px",
            fields: "15px",
            offset: "14px",
        },
        xs: {
            width: "500px",
            fields: "10px",
            offset: "5px",
        }
	},
    mixinNames: {
	    container: 'container'
    }
};