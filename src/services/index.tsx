import axios from "axios";

export const getColour = async () => {
    try {
        const response = await axios.get('https://raw.githubusercontent.com/okmediagroup/color-test-resources/master/xkcd-colors.json');
        return response.data.colors;
    } catch (error) {
        console.error(error);
        return 'error';
    }
}