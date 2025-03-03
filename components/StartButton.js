import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const StartButton = ({ onPress, title }) => (
    <TouchableOpacity 
        onPress={onPress}
        style={{
            position: 'absolute',
            top: 100,
            left: 0,
            right: 0,
            padding: 20,
            backgroundColor: '#333',
            borderRadius: 10,
            margin: 5,
            alignItems: 'center'
        }}
    >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
    </TouchableOpacity>
);

export default StartButton;