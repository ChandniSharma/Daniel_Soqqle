import { StyleSheet, Platform, Dimensions } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const statusBarHeight = Platform.OS === 'ios' ? 0 : 0;
const width = Dimensions.get('window').width; //full width
const styles = StyleSheet.create({
    container: {
        padding: 0,
        paddingTop: statusBarHeight,
        backgroundColor: '#10123b',
        flex: 1
    },
    header: {
        height: hp('8%'),
        paddingHorizontal: wp('4%'),
        backgroundColor: '#800094',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: width,
    },
    headerIcon: {
        width: wp('8%'),
        height: hp('4%'),
    },
    headerFontIcon: {
        fontSize: wp('9%'),
        color: '#ffffff'
    },
    storyContainerView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: hp('4%'),
        height: hp('82%'),
    },
    storyContainer: {
        backgroundColor: '#56478C',
        width: wp('90%'),
    },
    challengeContainer: {
        backgroundColor: '#7D0080',
        width: wp('90%'),
    },
    storyItemImage: {
        alignSelf: 'center',
        width: '100%',
        height: hp('35%'),
    },
    storyItemVideo: {
        alignSelf: 'center',
        width: '100%',
        height: hp('35%'),
    },
    storyContent: {
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('2%'),
    },
    challengeItemTitle: {
        color: '#fff',
        fontSize: wp('4.8%'),
        fontWeight: '500',
    },
    storyItemText: {
        color: '#ffffff',
        textAlign: 'center',
        fontSize: wp('4.6%'),
        minHeight: 80,
    },
    challengeItemText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: wp('4%'),
        minHeight: 70,
        paddingTop: 2,
    },
    storyTagContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: hp('2%'),
    },
    storyTag: {
        color: '#ffffff',
        paddingVertical: wp('2%'),
        paddingHorizontal: 10,
        fontSize: 11,
        marginBottom: hp('1%'),
        fontWeight: '700',
        borderRadius: 15,
        overflow: 'hidden'
    },
    objectiveTag: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ffffff',
    },
    quotaTag: {
        backgroundColor: '#1FBEB8'
    },
    rewardTag: {
        backgroundColor: '#FFC600',
        marginRight: 0,
    },
    storyActionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: hp('3%'),
    },
    storyActionBlock: {
        borderRadius: 30,
        borderWidth: 1,
        borderStyle: 'solid',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 10,
    },
    storyActionIcon: {
        width: wp('7%'),
        height: hp('3.5%'),
    },
    footer: {
        backgroundColor: '#800094',
        width: width,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    footerTab: {
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('4%'),
    },
    footerTabIcon: {
        marginTop: 2,
        textAlign: 'center',
        color: '#ffffff',
        fontSize: wp('5.5%')
    },
    footerTabText: {
        textAlign: 'center',
        color: '#fff',
        paddingTop: hp('1%'),
        fontSize: wp('3.5%'),
        fontWeight: '700',
    },
    likeModalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    likeModalInnerView: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        paddingVertical: 25,
        paddingHorizontal: 10,
        width: '90%',
        borderRadius: 5,
    },
    likeModalTitle: {
        fontSize: 20,
        color: '#000000',
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    likeModalText: {
        fontSize: 18,
        color: '#000000',
        marginBottom: 20,
        textAlign: 'center',
    },
    likeModalSeparator: {
        fontSize: 17,
        color: 'rgba(0, 0, 0, 0.6)',
        paddingVertical: 10,
        textAlign: 'center',
    },
    likeModalAction: {
        backgroundColor: '#2C2649',
        color: '#ffffff',
        fontSize: 17,
        paddingTop: 5,
        paddingBottom: 8,
        paddingHorizontal: 25,
        borderRadius: 25,
        alignSelf: 'center'

    },
    likeModalClose: {
        position: 'absolute',
        padding: 10,
        right: 5,
        top: 0
    },
    likeModalCloseIcon: {
        color: '#333333',
        fontSize: 20,
    },
    taskItem: {
        backgroundColor: '#2C2649',
        padding: 10,
        borderRadius: 5,
        marginVertical: 6,
    },
    taskItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    taskItemName: {
        fontSize: 15,
        letterSpacing: 1,
        color: '#ffffff',
        width: '90%'
    },
    taskItemSize: {
        color: '#1FBEB8',
        fontSize: 16,
    },
    taskItemFooter: {
        marginTop: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskItemExpiry: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 14,
    },
    taskItemXP: {
        color: '#9600A1',
        fontSize: 18,
    },
});

export default styles;