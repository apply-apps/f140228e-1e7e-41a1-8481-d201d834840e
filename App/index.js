// Filename: index.js
// Combined code from all files

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, ScrollView, View, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
    const [recipient, setRecipient] = useState('');
    const [occasion, setOccasion] = useState('');
    const [style, setStyle] = useState('');
    const [customRecipient, setCustomRecipient] = useState('');
    const [customOccasion, setCustomOccasion] = useState('');
    const [customStyle, setCustomStyle] = useState('');

    const recipients = [
        "Father",
        "Mother",
        "Boss",
        "Brother",
        "Sister",
        "Friend",
        "Custom"
    ];

    const occasions = [
        "Birthday",
        "Christmas",
        "New Year",
        "Graduation",
        "Wedding",
        "Custom"
    ];

    const styles = [
        "Formal",
        "Funny",
        "Heartfelt",
        "Casual",
        "Inspirational",
        "Custom"
    ];

    const handleGeneratePress = () => {
        let finalRecipient = recipient === "Custom" ? customRecipient : recipient;
        let finalOccasion = occasion === "Custom" ? customOccasion : occasion;
        let finalStyle = style === "Custom" ? customStyle : style;

        if (!finalRecipient || !finalOccasion || !finalStyle) {
            alert('Please fill all fields');
            return;
        }

        navigation.navigate('Result', {
            recipient: finalRecipient,
            occasion: finalOccasion,
            style: finalStyle
        });
    };

    return (
        <SafeAreaView style={homeScreenStyles.container}>
            <ScrollView contentContainerStyle={homeScreenStyles.scrollContainer}>
                <Text style={homeScreenStyles.title}>Congratulatory Message Generator</Text>
                
                <View style={homeScreenStyles.pickerContainer}>
                    <Text style={homeScreenStyles.label}>Recipient:</Text>
                    <Picker
                        selectedValue={recipient}
                        onValueChange={(itemValue) => setRecipient(itemValue)}
                        style={homeScreenStyles.picker}
                    >
                        {recipients.map((item, index) => (
                            <Picker.Item key={index} label={item} value={item} />
                        ))}
                    </Picker>
                    {recipient === "Custom" &&
                        <TextInput
                            style={homeScreenStyles.input}
                            placeholder="Custom Recipient Name"
                            value={customRecipient}
                            onChangeText={setCustomRecipient}
                        />
                    }
                </View>

                <View style={homeScreenStyles.pickerContainer}>
                    <Text style={homeScreenStyles.label}>Occasion:</Text>
                    <Picker
                        selectedValue={occasion}
                        onValueChange={(itemValue) => setOccasion(itemValue)}
                        style={homeScreenStyles.picker}
                    >
                        {occasions.map((item, index) => (
                            <Picker.Item key={index} label={item} value={item} />
                        ))}
                    </Picker>
                    {occasion === "Custom" &&
                        <TextInput
                            style={homeScreenStyles.input}
                            placeholder="Custom Occasion"
                            value={customOccasion}
                            onChangeText={setCustomOccasion}
                        />
                    }
                </View>

                <View style={homeScreenStyles.pickerContainer}>
                    <Text style={homeScreenStyles.label}>Style:</Text>
                    <Picker
                        selectedValue={style}
                        onValueChange={(itemValue) => setStyle(itemValue)}
                        style={homeScreenStyles.picker}
                    >
                        {styles.map((item, index) => (
                            <Picker.Item key={index} label={item} value={item} />
                        ))}
                    </Picker>
                    {style === "Custom" &&
                        <TextInput
                            style={homeScreenStyles.input}
                            placeholder="Custom Style"
                            value={customStyle}
                            onChangeText={setCustomStyle}
                        />
                    }
                </View>

                <Button title="Generate Message" onPress={handleGeneratePress} />
            </ScrollView>
        </SafeAreaView>
    );
}

const homeScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        padding: 20,
        paddingTop: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        marginTop: 8,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 16,
    },
    pickerContainer: {
        marginBottom: 16,
    },
});

function ResultScreen({ route }) {
    const { recipient, occasion, style } = route.params;
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const generateMessage = async () => {
            try {
                const response = await axios.post('http://dev.192.168.1.107.nip.io:3300/chatgpt', {
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant. Please provide answers for given requests.' },
                        { role: 'user', content: `Create a congratulatory message for ${recipient} on the occasion of ${occasion} in a ${style} style.` },
                    ],
                    model: 'gpt-4o',
                });

                const { data } = response;
                const resultString = data.response;
                setMessage(resultString);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'Failed to generate message');
            } finally {
                setLoading(false);
            }
        };

        generateMessage();
    }, [recipient, occasion, style]);

    return (
        <SafeAreaView style={resultScreenStyles.container}>
            <ScrollView contentContainerStyle={resultScreenStyles.scrollContainer}>
                {loading ? <Text>Loading...</Text> : <Text style={resultScreenStyles.message}>{message}</Text>}
            </ScrollView>
        </SafeAreaView>
    );
}

const resultScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        padding: 20,
        paddingTop: 16,
    },
    message: {
        marginTop: 20,
        fontSize: 16,
        fontStyle: 'italic',
    },
});

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Congratulatory Message Generator' }} />
                <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Generated Message' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}