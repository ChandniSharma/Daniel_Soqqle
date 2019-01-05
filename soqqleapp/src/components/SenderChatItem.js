import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    item: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    itemText: {
        color: '#ffffff',
        alignSelf: 'center',
        borderRadius: 5,
        backgroundColor: '#56478C',
        paddingVertical: 5,
        paddingBottom: 8,
        paddingHorizontal: 10,
    }
});

export default SenderChatItem = (props) => {
    return (
        <View style={styles.item}>
            <Image
                source={{ uri: 'https://randomuser.me/api/portraits/women/74.jpg' }}
                resizeMode='cover'
                style={styles.itemImage}
            />
            <Text style={styles.itemText}>Hello Matt! I am ready to help you! What topic do you have a question?</Text>
        </View>
    )
}