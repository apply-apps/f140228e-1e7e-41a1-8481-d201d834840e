// Filename: index.js
// Combined code from all files
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button } from 'react-native';
import axios from 'axios';

export default function App() {
    const [recipient, setRecipient] = useState('');
    const [occasion, setOccasion] = useState('');
    const [style, setStyle] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const generateMessage = async () => {
        if (!recipient || !occasion || !style) {
            alert('Please fill all fields');
            return;
        }

        setLoading(true);

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
            alert('Failed to generate message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Congratulatory Message Generator</Text>
            <TextInput
                style={styles.input}
                placeholder="Recipient Name"
                value={recipient}
                onChangeText={setRecipient}
            />
            <TextInput
                style={styles.input}
                placeholder="Occasion (e.g., Birthday, Christmas)"
                value={occasion}
                onChangeText={setOccasion}
            />
            <TextInput
                style={styles.input}
                placeholder="Style (e.g., Formal, Funny)"
                value={style}
                onChangeText={setStyle}
            />
            <Button title="Generate Message" onPress={generateMessage} disabled={loading} />
            {loading ? <Text>Loading...</Text> : message ? <Text style={styles.message}>{message}</Text> : null}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
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
    message: {
        marginTop: 20,
        fontSize: 16,
        fontStyle: 'italic',
    },
});