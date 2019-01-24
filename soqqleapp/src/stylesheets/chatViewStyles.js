import { Platform, StyleSheet } from 'react-native';

const statusBarHeight = Platform.OS === 'ios' ? 0 : 0;
const styles = StyleSheet.create({
    container: {
        padding: 0,
        paddingTop: statusBarHeight,
        backgroundColor: '#ffffff',
        flex: 1,
        flexDirection: 'column'
    },
    headerStyle: {
        backgroundColor: '#F8F8F8',
        elevation: 0,
    },
    headerIconStyle: {
        color: '#130C38'
    },
    headerRightTextStyle: {
        color: '#1FBEB8'
    },
    storyDetailView: {
        paddingVertical: 15,
        paddingTop: 5,
        paddingHorizontal: 15,
        backgroundColor: '#F8F8F8',
    },
    storyDetailHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    storyDetailTitle: {
        fontSize: 18,
        color: '#000000',
        width: '70%',
        fontWeight: '400'
    },
    storyDetailXP: {
        fontSize: 16,
        color: '#9600A1',
        fontWeight: '500'
    },
    storyDetailText: {
        paddingVertical: 10,
        fontSize: 14,
        color: '#000000'
    },
    storyDetailTagTitle: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '400'
    },
    storyDetailTags: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    storyDetailTag: {
        color: '#9600A1',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#9600A1',
        marginRight: 8,
    },
    storyDetailActionTag: {
        color: '#FFFFFF',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#1FBEB8'
    },
    chatView: {
        flex: 1,
        flexDirection: 'column',
        shadowColor: 'rgba(0, 0, 0, 0.9)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        elevation: 5,
    },
    chatItemsView: {
        flex: 1,
        padding: 15,
    },
    chatItem: {
        width: '100%',
        marginBottom: 10,
    },
    chatActionView: {
        height: 50,
        backgroundColor: '#F8F8F8',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    chatAttachmentIcon: {
        color: '#cccccc',
        fontSize: 20,
        marginRight: 15,
    },
    chatInputItem: {
        height: 30,
        backgroundColor: '#ffffff',
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 10,
        width: '80%',
        paddingVertical: 0,
        paddingHorizontal: 10,
    },
    viewShowMember: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 10,
    },
    member1: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: -5
    },
    member2: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: -5
    },
    plusMemberView: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderColor: '#9600A1',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    plusTxt: {
        color: '#9600A1',
        fontSize: 14,
    },
    viewChatContainer: {
        flexDirection: 'row',
        backgroundColor: '#F2F2F2',
        bottom: 10,
        alignSelf: 'center',
        position: 'absolute',
    },
    viewChat: {
        flexDirection: 'row',
        borderRadius: 5,
        borderColor: 'green',
        borderWidth: 1,
    },
    sendImage: {
        width: 32,
        height: 32,
        alignSelf: 'flex-end',
    },
    textInput: {
        alignSelf: 'flex-start',
    },
});

export default styles;