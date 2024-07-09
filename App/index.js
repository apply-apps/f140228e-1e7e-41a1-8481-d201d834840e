// Filename: index.js
// Combined code from all files
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, ScrollView, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

export default function App() {
    const [recipient, setRecipient] = useState('');
    const [occasion, setOccasion] = useState('');
    const [style, setStyle] = useState('');
    const [customRecipient, setCustomRecipient] = useState('');
    const [customOccasion, setCustomOccasion] = useState('');
    const [customStyle, setCustomStyle] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

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

    const generateMessage = async () => {
        let finalRecipient = recipient === "Custom" ? customRecipient : recipient;
        let finalOccasion = occasion === "Custom" ? customOccasion : occasion;
        let finalStyle = style === "Custom" ? customStyle : style;
        
        if (!finalRecipient || !finalOccasion || !finalStyle) {
            alert('Please fill all fields');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://dev.192.168.1.107.nip.io:3300/chatgpt', {
                messages: [
                    { role: 'system', content: 'You are a helpful assistant. Please provide answers for given requests.' },
                    { role: 'user', content: `Create a congratulatory message for ${finalRecipient} on the occasion of ${finalOccasion} in a ${finalStyle} style.` },
                ],
                model: 'gpt-4o',
            });

            const { data } = response;
            const resultString = data.response;
            setMessage(resultString);
        } catch (error) {
            console.error(error);
            alert('Failed to generate message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Congratulatory Message Generator</Text>
                
                <Picker
                    selectedValue={recipient}
                    onValueChange={(itemValue) => setRecipient(itemValue)}
                    style={styles.picker}
                >
                    {recipients.map((item, index) => (
                        <Picker.Item key={index} label={item} value={item} />
                    ))}
                </Picker>
                {recipient === "Custom" &&
                    <TextInput
                        style={styles.input}
                        placeholder="Custom Recipient Name"
                        value={customRecipient}
                        onChangeText={setCustomRecipient}
                    />
                }

                <Picker
                    selectedValue={occasion}
                    onValueChange={(itemValue) => setOccasion(itemValue)}
                    style={styles.picker}
                >
                    {occasions.map((item, index) => (
                        <Picker.Item key={index} label={item} value={item} />
                    ))}
                </Picker>
                {occasion === "Custom" &&
                    <TextInput
                        style={styles.input}
                        placeholder="Custom Occasion"
                        value={customOccasion}
                        onChangeText={setCustomOccasion}
                    />
                }

                <Picker
                    selectedValue={style}
                    onValueChange={(itemValue) => setStyle(itemValue)}
                    style={styles.picker}
                >
                    {styles.map((item, index) => (
                        <Picker.Item key={index} label={item} value={item} />
                    ))}
                </Picker>
                {style === "Custom" &&
                    <TextInput
                        style={styles.input}
                        placeholder="Custom Style"
                        value={customStyle}
                        onChangeText={setCustomStyle}
                    />
                }

                <Button title="Generate Message" onPress={generateMessage} disabled={loading} />
                {loading ? <Text>Loading...</Text> : message ? <Text style={styles.message}>{message}</Text> : null}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 16,
    },
    message: {
        marginTop: 20,
        fontSize: 16,
        fontStyle: 'italic',
    },
});