import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const ControlButton = ({ onPress, title, style }) => (
    <TouchableOpacity 
        onPress={onPress}
        style={[{
            padding: 20,
            backgroundColor: '#333',
            borderRadius: 10,
            margin: 5
        }, style]}
    >
        <Text style={{ color: 'white', textAlign: 'center' }}>{title}</Text>
    </TouchableOpacity>
);

export default ControlButton;