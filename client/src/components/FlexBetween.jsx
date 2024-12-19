// this a styled component for reusabale css in component like manner

const { Box } = require("@mui/material");
const { styled} = require("@mui/system");


const FlexBetween = styled(Box)({
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center"
});


export default FlexBetween;