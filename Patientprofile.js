import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const UserDetails = () => {
    const route = useRoute();
    const { username } = route.params;
    const [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (username) {
            fetchUserDetails(username);
        }
    }, [username]);

    const fetchUserDetails = (username) => {
        axios.get('http://192.168.40.121/Database/Patientprofile.php', {
            params: { username }
        })
        .then(response => {
            console.log('API Response:', response.data); // Log the API response
            if (response.data.status === 'success') {
                setUserDetails(response.data.data);
                setError('');
            } else {
                setError(response.data.message);
                setUserDetails(null);
            }
        })
        .catch(error => {
            console.error('API Error:', error); // Log any errors
            setError('An error occurred. Please try again.');
            setUserDetails(null);
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.gradient}>
                <View style={styles.header}>
                    {userDetails && userDetails.image_path && (
                        <Image
                            source={{ uri: `http://192.168.40.121/Database/${userDetails.image_path}` }} // Corrected image URL
                            style={styles.profileImage}
                        />
                    )}
                    {userDetails && (
                        <Text style={styles.name}>{userDetails.pname}</Text>
                    )}
                </View>
                {error ? <Text style={styles.error}>{error}</Text> : null}
                {userDetails ? (
                    <View style={styles.detailsContainer}>
                        <View style={styles.details}>
                            <Text style={styles.label}>Username</Text>
                            <TextInput
                                style={styles.input}
                                value={userDetails.username}
                                editable={false}
                                placeholder="Username"
                                placeholderTextColor="#FFFFFF"
                            />
                            <Text style={styles.label}>Mobile</Text>
                            <TextInput
                                style={styles.input}
                                value={userDetails.mob}
                                editable={false}
                                placeholder="Mobile"
                                placeholderTextColor="#FFFFFF"
                            />
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={userDetails.mail}
                                editable={false}
                                placeholder="Email"
                                placeholderTextColor="#FFFFFF"
                            />
                            <Text style={styles.label}>Gender</Text>
                            <TextInput
                                style={styles.input}
                                value={userDetails.gender}
                                editable={false}
                                placeholder="Gender"
                                placeholderTextColor="#FFFFFF"
                            />
                            <Text style={styles.label}>Age</Text>
                            <TextInput
                                style={styles.input}
                                value={userDetails.age.toString()} // Ensure age is converted to a string
                                editable={false}
                                placeholder="Age"
                                placeholderTextColor="#FFFFFF"
                            />
                            <Text style={styles.label}>Blood Group</Text>
                            <TextInput
                                style={styles.input}
                                value={userDetails.bloodgroup}
                                editable={false}
                                placeholder="Blood Group"
                                placeholderTextColor="#FFFFFF"
                            />
                        </View>
                    </View>
                ) : null}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
    },
    gradient: {
        flex: 1,
        padding: 16,
        backgroundColor: 'linear-gradient(180deg, #D3CCE3 0%, #E9E4F0 100%)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: -10,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius:90,
        marginBottom: -100,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        top:110,
    },
    detailsContainer: {
        width: '100%',
        padding: 15,
        marginTop: 130,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        height:'70%',
    },
    details: {
        marginTop: 0,
    },
    label: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 5,
        marginTop: 10,
        marginLeft:5,
    },
    input: {
        backgroundColor: '#603F83FF',
        borderRadius: 8,
        padding: 10,
        marginTop:-2,
        fontSize: 18,
        color: '#FFFFFF',
    },
    text: {
        color: '#FFFFFF',
        fontSize: 18,
        marginBottom: 10,
    },
    error: {
        color: 'red',
        fontSize: 16,
        marginVertical: 10,
    },
});

export default UserDetails;
