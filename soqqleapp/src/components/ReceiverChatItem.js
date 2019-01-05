import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    item: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
    },
    itemImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: 10,
    },
    itemText: {
        color: '#ffffff',
        alignSelf: 'center',
        borderRadius: 5,
        backgroundColor: '#1FBEB8',
        paddingVertical: 5,
        paddingBottom: 8,
        paddingHorizontal: 10,
    }
});

export default ReceiverChatItem = (props) => {
    return (
        <View style={styles.item}>
            <Text style={styles.itemText}>Identity Verification</Text>
            <Image
                source={{ uri: 'https://randomuser.me/api/portraits/women/74.jpg' }}
                resizeMode='cover'
                style={styles.itemImage}
            />
        </View>
    )
}