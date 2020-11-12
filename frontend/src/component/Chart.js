import {Image} from 'semantic-ui-react';
/**
 * Component used to perform data visualization for the query results retrieved from the db search.
 */
const Chart = () => {

    return(   <Image size="massive" src='data:image/png;base64,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' />);
}

export default Chart;