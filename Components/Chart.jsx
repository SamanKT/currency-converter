import { Text as SvgText } from "react-native-svg";
import { BarChart, Grid } from "react-native-svg-charts";

export const Chart = ({ data }) => {
  const CUT_OFF = 20;
  const Labels = ({ x, y, bandwidth, data }) =>
    data.map((value, index) => (
      <SvgText
        key={index}
        x={x(index) + bandwidth / 2}
        y={value < CUT_OFF ? y(value) - 10 : y(value) + 15}
        fontSize={14}
        fill={value >= CUT_OFF ? "white" : "black"}
        alignmentBaseline={"middle"}
        textAnchor={"middle"}
      >
        {value.toFixed(3)}
      </SvgText>
    ));

  return (
    <BarChart
      style={{ flex: 1, height: 200, width: "80%" }}
      data={data}
      svg={{ fill: "rgba(17, 107, 130, 0.6)" }}
      contentInset={{ top: 10, bottom: 10 }}
      spacing={0.2}
      gridMin={0}
      animated={true}
      yMax={data.length > 0 ? Math.max(...data) * 1.3 : 0}
    >
      <Grid direction={Grid.Direction.HORIZONTAL} />
      <Labels />
    </BarChart>
  );
};
