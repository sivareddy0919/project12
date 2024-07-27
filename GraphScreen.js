import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const GraphScreen = () => {
  const route = useRoute();
  const { fromDate = '2024-07-17', toDate = '2024-07-23' } = route.params || {};
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
        label: 'Insulin Intake',
      },
      {
        data: [],
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(153, 102, 255, ${opacity})`,
        label: 'Sugar Concentration',
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.post('http://192.168.40.121/Database/GraphScreen.php', {
          username: 'exampleUser', // Replace with the actual username
          start_date: fromDate,
          end_date: toDate,
        });

        console.log(response.data); // Inspect the response data

        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          const insulinIntakeData = response.data.map(entry => entry.insulinintake);
          const sugarConcentrationData = response.data.map(entry => entry.sugar_concentration);
          const labels = response.data.map(entry => entry.datetime);

          setGraphData({
            labels,
            datasets: [
              {
                data: insulinIntakeData,
                strokeWidth: 2,
                color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
                label: 'Insulin Intake',
              },
              {
                data: sugarConcentrationData,
                strokeWidth: 2,
                color: (opacity = 1) => `rgba(153, 102, 255, ${opacity})`,
                label: 'Sugar Concentration',
              },
            ],
          });
        } else {
          console.error('Expected an array but received:', response.data);
          setError("Failed to load data. The data format is incorrect.");
        }
      } catch (error) {
        setError("Failed to load data. Please try again later.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fromDate, toDate]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>{error}</Text>
      </View>
    );
  }

  if (graphData.labels.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>No Data Available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Insulin Intake and Sugar Concentration Levels</Text>
      <LineChart
        data={graphData}
        width={width - 16}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
  },
  heading: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default GraphScreen;
