import React, { useEffect, useState } from 'react';
import { View, Dimensions, StyleSheet, ScrollView, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const LineGraphExample = ({ route }) => {
    const { username } = route.params || {};

    const [sugarConcentration, setSugarConcentration] = useState([]);
    const [insulinIntake, setInsulinIntake] = useState([]);
    const [labels, setLabels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://192.168.40.121/Database/GraphScreen.php', {
                    params: { username }
                });

                if (!response.data || response.data.status !== "success" || !Array.isArray(response.data.data)) {
                    throw new Error("Invalid response format");
                }

                const fetchedData = response.data.data;

                if (fetchedData.length === 0) {
                    throw new Error("No data found");
                }

                const fetchedSugarConcentration = fetchedData.map(item => parseFloat(item.sugar_concentration));
                const fetchedInsulinIntake = fetchedData.map(item => parseFloat(item.insulinintake));

                const fetchedLabels = fetchedData.map(item => {
                    const date = new Date(item.datetime);
                    const hours = date.getHours();
                    const session = hours < 12 ? 'M' : hours < 18 ? 'A' : 'N';
                    return `${session}\n${date.getDate()}/${date.getMonth() + 1}`;
                });

                setSugarConcentration(fetchedSugarConcentration);
                setInsulinIntake(fetchedInsulinIntake);
                setLabels(fetchedLabels);
                setLoading(false);
            } catch (error) {
                console.error('Fetch data error:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        if (username) {
            fetchData();
        }
    }, [username]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error || sugarConcentration.length === 0 || insulinIntake.length === 0) {
        return (
            <View style={styles.container}>
                <Text>{error ? `Error: ${error}` : 'Data Not Found'}</Text>
            </View>
        );
    }

    return (
        <View style={styles.outerContainer}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.topContainer}>
                    <Text style={styles.topTitle}>Graphs</Text>
                </View>
                <View style={styles.chartContainer}>
                    
                    <View style={styles.chartWrapper}>
                        <View style={styles.yAxisContainer}>
                            {[700, 650, 600, 550, 500, 450, 400, 350, 300, 250, 200, 150, 100, 50, 0].map((value, index) => (
                                <Text key={index} style={styles.yAxisLabel}>
                                    {value}
                                </Text>
                            ))}
                        </View>
                        <ScrollView horizontal contentContainerStyle={styles.chartScrollContainer}>
                            <View style={styles.chartInnerContainer}>
                                <LineChart
                                    data={{
                                        labels: labels,
                                        datasets: [
                                            {
                                                data: sugarConcentration,
                                                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                                                strokeWidth: 0.8,
                                            },
                                        ],
                                        legend: ["Sugar Concentration"]
                                    }}
                                    width={Math.max(windowWidth - 40, labels.length * 50)}
                                    height={windowHeight * 0.8}  // Increase the height to provide more vertical space
                                    yAxisSuffix=""
                                    yAxisInterval={1}  // Adjust this to control the number of labels
                                    fromZero={true}
                                    yAxisLabel=""
                                    chartConfig={{
                                        backgroundColor: '#DFDFDF',
                                        backgroundGradientFrom: '#603F83FF',
                                        backgroundGradientTo: '#DFDFDF',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        style: {
                                            borderRadius: 16,
                                        },
                                        propsForDots: {
                                            r: '4',
                                            strokeWidth: '0.2',
                                            stroke: '#007AFF',
                                        },
                                        propsForBackgroundLines: {
                                            strokeDasharray: '',
                                        },
                                        fillShadowGradient: '#007AFF',
                                        fillShadowGradientOpacity: 0.1,
                                        propsForLabels: {
                                            fontSize: 10,
                                            fontWeight: 'normal',
                                        },
                                    }}
                                    yLabelsOffset={9}  // Adjust to fit labels better
                                    bezier
                                    segments={14}  // Increase the number of segments
                                    style={styles.chart}
                                />
                            </View>
                        </ScrollView>
                    </View>
                    <View style={styles.xAxisContainer}>
                        {labels.map((label, index) => (
                            <Text key={index} style={styles.xAxisLabel}>
                                {label}
                            </Text>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollViewContainer: {
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    topContainer: {
        padding: 10,
        backgroundColor: '#603F83FF',
        height: windowHeight * 0.10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: windowWidth * -0.03,
        marginTop: windowHeight * -0.03,
        width: '120%',
    },
    topTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    chartContainer: {
        marginTop: windowHeight * 0.01,
        position: 'relative',
    },
    chartWrapper: {
        flexDirection: 'row',
    },
    chartScrollContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chartInnerContainer: {
        paddingHorizontal: 20,
    },
    xAxisContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: 'transparent',
    },
    xAxisLabel: {
        fontSize: 0,
        textAlign: 'center',
    },
    chart: {
        borderRadius: 10,
        height: windowHeight * 0.85,
    },
    yAxisContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 14,  // Space between the chart and the labels
        paddingVertical: 0,
        marginTop:windowHeight*0.031,
    },
    yAxisLabel: {
        fontSize: 11,
        textAlign: 'center',
        marginVertical: 8.8,  // Space between each label
    },
    chartInnerContainer: {
        paddingHorizontal: 0,
    },
});

export default LineGraphExample;
