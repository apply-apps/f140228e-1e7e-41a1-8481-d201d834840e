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

    const recipients = ["Father", "Mother", "Boss", "Brother", "Sister", "Friend", "Custom"];
    const occasions = ["Birthday", "Christmas", "New Year", "Graduation", "Wedding", "Custom"];
    const stylesList = ["Formal", "Funny", "Heartfelt", "Casual", "Inspirational", "Custom"];

    const handleGeneratePress = () => {
        let finalRecipient = recipient === "Custom" ? customRecipient : recipient;
        let finalOccasion = occasion === "Custom" ? customOccasion : occasion;
        let finalStyle = style === "Custom" ? customStyle : style;

        if (!finalRecipient || !finalOccasion || !finalStyle) {
            alert('Please fill all fields');
            return;
        }

        navigation.navigate('Result', { recipient: finalRecipient, occasion: finalOccasion, style: finalStyle });
    };

    return (
        <SafeAreaView style={stylesContainer.container}>
            <ScrollView contentContainerStyle={stylesContainer.scrollContainer}>
                <Text style={stylesContainer.title}>Congratulatory Message Generator</Text>
                
                <Picker selectedValue={recipient} onValueChange={(itemValue) => setRecipient(itemValue)} style={stylesContainer.picker}>
                    {recipients.map((item, index) => (
                        <Picker.Item key={index} label={item} value={item} />
                    ))}
                </Picker>
                {recipient === "Custom" && <TextInput style={stylesContainer.input} placeholder="Custom Recipient Name" value={customRecipient} onChangeText={setCustomRecipient} />}

                <Picker selectedValue={occasion} onValueChange={(itemValue) => setOccasion(itemValue)} style={stylesContainer.picker}>
                    {occasions.map((item, index) => (
                        <Picker.Item key={index} label={item} value={item} />
                    ))}
                </Picker>
                {occasion === "Custom" && <TextInput style={stylesContainer.input} placeholder="Custom Occasion" value={customOccasion} onChangeText={setCustomOccasion} />}

                <Picker selectedValue={style} onValueChange={(itemValue) => setStyle(itemValue)} style={stylesContainer.picker}>
                    {stylesList.map((item, index) => (
                        <Picker.Item key={index} label={item} value={item} />
                    ))}
                </Picker>
                {style === "Custom" && <TextInput style={stylesContainer.input} placeholder="Custom Style" value={customStyle} onChangeText={setCustomStyle} />}

                <Button title="Generate Message" onPress={handleGeneratePress} />
            </ScrollView>
        </SafeAreaView>
    );
}

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
        <SafeAreaView style={stylesContainer.container}>
            <ScrollView contentContainerStyle={stylesContainer.scrollContainer}>
                {loading ? <Text>Loading...</Text> : <Text style={stylesContainer.message}>{message}</Text>}
            </ScrollView>
        </SafeAreaView>
    );
}

const stylesContainer = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContainer: { padding: 20, paddingTop: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    input: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16 },
    picker: { height: 50, width: '100%', marginBottom: 16 },
    message: { marginTop: 20, fontSize: 16, fontStyle: 'italic' },
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