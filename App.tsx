import { Alert, Image, Platform, SafeAreaView, StatusBar } from "react-native";
import { ScrollView } from "react-native";
import { StyleSheet, Text, View } from "react-native";

import { useFonts, Inter_900Black } from "@expo-google-fonts/inter";
import { SvgUri } from "react-native-svg";

import DropDownPicker from "react-native-dropdown-picker";
import { useEffect, useState } from "react";
import { TextInput } from "react-native";
import LineWithContent from "./Components/LineWithContent";
import { API_KEY, COUNTRY_CURRENCY, SAMPLE_DATA } from "./Constants";
import { Button } from "react-native-paper";
import Background from "./Background";
import currencyapi from "@everapi/currencyapi-js";
import { Chart } from "./Chart";

const data = [35, 50, 40];

const cardHeight: number = 500;
const contentHeight: number = 200;

export default function App() {
  const client = new currencyapi(API_KEY);
  const [latest, setLatest] = useState(SAMPLE_DATA);

  useEffect(() => {
    const getLatest = async () => {
      const response = await client.latest().catch(() => {
        Alert.alert(
          "The API is limited to 300 requests per month, please try again later."
        );
      });
      setLatest(response);
    };
    const date = latest.meta.last_updated_at;
    const convertToDate = new Date(date).toLocaleDateString();
    const now = new Date().toLocaleDateString();
    if (now !== convertToDate) {
      getLatest();
    }
    Alert.alert(
      "Welcome",
      "This is a sample app using a free API, it is limited to 300 requests per month."
    );
    //
  }, []);

  const [items, setItems] = useState<{ label: string; value: string }[]>(
    Object.entries(COUNTRY_CURRENCY).map(([key, value]) => ({
      label: key + "-" + value,
      value: key,
    }))
  );
  const [openIn, setOpenIn] = useState<boolean>(false);
  const [valueIn, setValueIn] = useState(items[242].value);
  const [openOut, setOpenOut] = useState<boolean>(false);
  const [valueOut, setValueOut] = useState(items[232].value);
  const [amountIn, setAmountIn] = useState<string>("0");
  const [amountOut, setAmountOut] = useState<string>((0.0).toFixed(2));
  const [chartData, setChartData] = useState<number[]>([]);

  const handleInput = (text: string) => {
    const data = latest?.data;
    const inputCurrency: number =
      data?.[
        COUNTRY_CURRENCY[
          valueIn as keyof typeof COUNTRY_CURRENCY
        ] as keyof typeof latest.data
      ]?.value;

    const outputCurrency: number =
      data?.[
        COUNTRY_CURRENCY[
          valueOut as keyof typeof COUNTRY_CURRENCY
        ] as keyof typeof latest.data
      ]?.value;

    const conversionRate = outputCurrency / inputCurrency;

    const outputAmount = text !== "" ? parseFloat(text) * conversionRate : 0;
    setAmountIn(text);
    setAmountOut(outputAmount.toFixed(2));
  };

  const resetAmounts = () => {
    setAmountIn("");
    setAmountOut("");
    setChartData([]);
  };

  const handleBtnClicked = async () => {
    const currencyIn = COUNTRY_CURRENCY[
      valueIn as keyof typeof COUNTRY_CURRENCY
    ] as keyof typeof latest.data;
    const currencyOut = COUNTRY_CURRENCY[
      valueOut as keyof typeof COUNTRY_CURRENCY
    ] as keyof typeof latest.data;

    const today = new Date();
    const dates = [];
    for (let i = 0; i < 3; i++) {
      today.setDate(today.getDate() - 1);
      dates.push(today.toISOString().slice(0, 10));
    }

    dates.map(async (date) => {
      const response = await client.historical({
        base_currency: currencyIn,
        currencies: currencyOut,
        date: date,
      });

      const currValue =
        response.data[currencyOut as keyof typeof response.data].value;

      setChartData((chartData) => [...chartData, currValue as number]);
    });
  };

  let [fontsLoaded] = useFonts({
    Inter_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }

  interface Data<T> {
    value: T;
  }

  const ExchangeComponentIn = (
    <ScrollView
      horizontal={true}
      bounces={false}
      contentContainerStyle={styles.contents}
    >
      <SvgUri
        width={60}
        height={60}
        uri={
          "https://hatscripts.github.io/circle-flags/flags/" +
          valueIn.toLowerCase() +
          ".svg"
        }
      />

      <DropDownPicker
        open={openIn}
        value={valueIn}
        items={items}
        setOpen={setOpenIn}
        setValue={setValueIn}
        setItems={setItems}
        style={styles.dropDownPicker}
        containerStyle={styles.countryPicker}
        textStyle={styles.dropDownTextStyle}
        placeholder="Currency"
        placeholderStyle={{ color: "#000" }}
        searchable={true}
        searchPlaceholder="search"
        maxHeight={contentHeight - 50}
        onChangeValue={resetAmounts}
      />

      <TextInput
        value={amountIn}
        onChangeText={handleInput}
        style={styles.input}
        placeholder="amount"
        inputMode="numeric"
        onFocus={resetAmounts}
      />
    </ScrollView>
  );
  const ExchangeComponentOut = (
    <ScrollView
      horizontal={true}
      bounces={false}
      contentContainerStyle={[styles.contents]}
    >
      <SvgUri
        width={60}
        height={60}
        uri={
          "https://hatscripts.github.io/circle-flags/flags/" +
          valueOut.toLowerCase() +
          ".svg"
        }
      />

      <DropDownPicker
        open={openOut}
        value={valueOut}
        items={items}
        setOpen={setOpenOut}
        setValue={setValueOut}
        setItems={setItems}
        style={styles.dropDownPicker}
        containerStyle={styles.countryPicker}
        placeholder="Currency"
        placeholderStyle={{ color: "#000" }}
        textStyle={styles.dropDownTextStyle}
        searchable={true}
        maxHeight={contentHeight - 50}
        searchPlaceholder="search"
        onChangeValue={resetAmounts}
      />

      <TextInput
        style={[styles.input, { backgroundColor: "#BFC9CA" }]}
        placeholder="amount"
        value={amountOut}
        onChangeText={setAmountOut}
        onFocus={() => setAmountOut("")}
        inputMode="numeric"
        editable={false}
      />
    </ScrollView>
  );

  return (
    <Background>
      <SafeAreaView>
        <ScrollView scrollEventThrottle={20}>
          <View style={styles.container}>
            <Text style={styles.title}>Convert the Currencies Live!</Text>
            <View style={styles.card}>
              <Text style={styles.descriptiveText}>Input currency</Text>
              {ExchangeComponentIn}

              <View style={styles.middleLine}>
                <LineWithContent
                  content={
                    <Image
                      source={require("./assets/images/exchange-icon.png")}
                      resizeMode="contain"
                      style={styles.exchangeIcon}
                    />
                  }
                />
              </View>
              <Text style={styles.descriptiveText}>Converted currency</Text>
              {ExchangeComponentOut}
            </View>

            <Text style={[styles.title, { marginBottom: 15 }]}>
              Last Three Days Chart of{" "}
              {COUNTRY_CURRENCY[valueIn as keyof typeof COUNTRY_CURRENCY]} to{" "}
              {COUNTRY_CURRENCY[valueOut as keyof typeof COUNTRY_CURRENCY]}{" "}
              Conversion
            </Text>

            <Chart data={chartData} />
            <Button
              mode="contained"
              buttonColor="dodgerblue"
              style={styles.button}
              icon="arrow-left-right-bold"
              onPress={handleBtnClicked}
            >
              Show Changes
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  title: {
    fontFamily: "Inter_900Black",
    fontSize: 18,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    textAlign: "center",
  },
  card: {
    width: "90%",
    height: cardHeight,
    backgroundColor: "#EDF3F2",
    marginVertical: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  contents: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 5,
    marginTop: 20,
    height: contentHeight,
  },

  input: {
    width: "35%",
    minWidth: 100,
    height: 50,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  countryPicker: {
    width: "40%",
    marginHorizontal: 10,
    borderWidth: 0,
  },
  dropDownPicker: { borderWidth: 0 },
  exchangeIcon: {
    width: 50,
    height: 50,
  },
  dropDownTextStyle: {
    fontFamily: "Inter_900Black",
  },
  middleLine: {
    position: "absolute",
    zIndex: -1,
    width: "100%",
    top: contentHeight - 40,
  },
  descriptiveText: {
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 10,
    opacity: 0.6,
  },
  button: {
    width: "80%",
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: "center",
    marginTop: 30,
    marginRight: 20,
  },
  background: {
    //position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
});
