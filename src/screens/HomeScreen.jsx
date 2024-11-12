import React, { useCallback, useRef, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Dimensions, Pressable, StatusBar, Animated, Modal, TextInput, Share, Alert } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons'
const videoData = [
    { id: '1', title: 'Video 1', url: require('../assets/video.mp4') },
    { id: '2', title: 'Video 2', url: require('../assets/video3.mp4') },
    { id: '3', title: 'Video 3', url: require('../assets/video2.mp4') },
    { id: '4', title: 'Video 4', url: require('../assets/video4.mp4') },
    // Add more sample data
];

export default HomeScreen = () => {
    const [currentVideoId, setCurrentVideoId] = useState(null);
    const viewabilityConfig = { itemVisiblePercentThreshold: 80 };  // 80% visibility triggers play
    const [progress, setProgress] = useState(0);
    const { width, height } = Dimensions.get('window');
    const videoRefs = useRef([]);
    const [pausedVideos, setPausedVideos] = useState({});
    const [likedVideos, setLikedVideos] = useState({}); // Track liked videos
    const [commentModalVisible, setCommentModalVisible] = useState(false); // Modal visibility for comments
    const [currentComment, setCurrentComment] = useState(''); // Track current comment input
    const [videoComments, setVideoComments] = useState({}); // Track comments for each video

    const scaleAnim = useRef(new Animated.Value(1)).current;  // For heart animation

    // Callback to handle viewable items
    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const visibleItem = viewableItems[0];
            const videoId = visibleItem.item.id;

            // Set the current video ID
            setCurrentVideoId(videoId);

            // Reset video playback position
            if (videoRefs.current[visibleItem.index]) {
                videoRefs.current[visibleItem.index].seek(0);
            }

            // Set the video to play if it was previously paused
            setPausedVideos(prevState => ({
                ...prevState,
                [videoId]: false, // Set the video to play when it's visible
            }));
        }
    }, []);
    const updateProgress = (progress) => {
        setProgress(progress); // Update sticky progress bar
    };

    // Handle like button press
    const handleLikePress = (videoId) => {
        // Toggle like state
        const newLikedVideos = { ...likedVideos };
        if (newLikedVideos[videoId]) {
            delete newLikedVideos[videoId]; // Un-like if already liked
        } else {
            newLikedVideos[videoId] = true; // Like the video
        }
        setLikedVideos(newLikedVideos);

        // Animate heart scaling effect
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1.2,
                friction: 3,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            }),
        ]).start();
    };

    // Handle comment button press
    const handleCommentPress = (videoId) => {
        setCurrentComment('');
        setCommentModalVisible(true);
    };

    // Handle comment submission
    const handleCommentSubmit = () => {
        const newComments = { ...videoComments };
        if (!newComments[currentVideoId]) {
            newComments[currentVideoId] = [];
        }
        newComments[currentVideoId].push(currentComment);
        setVideoComments(newComments);
        setCurrentComment('');
        setCommentModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="black" // Background color for Android
                barStyle="light-content" // Content style for both Android and iOS (use "dark-content" for dark text/icons)
            />
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 600, position: 'absolute', top: 10, zIndex: 1 }}>Following | For You</Text>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={videoData}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <VideoItem item={item} currentVideoId={currentVideoId} onProgressUpdate={updateProgress}
                        videoRef={(ref) => { videoRefs.current[index] = ref }}
                        isPaused={pausedVideos[item.id] || false}  // Check if the video is paused
                        onPause={() => setPausedVideos(prevState => ({ ...prevState, [item.id]: true }))}  // Pause video
                        onPlay={() => setPausedVideos(prevState => ({ ...prevState, [item.id]: false }))}  // Play video
                        onLikePress={handleLikePress}  // Handle like button press
                        isLiked={likedVideos[item.id]}  // Check if the video is liked
                        scaleAnim={scaleAnim}  // Animation for the heart
                        onCommentPress={handleCommentPress}  // Handle comment button press
                        comments={videoComments[item.id] || []}  // Display current video comments
                    />
                )}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                pagingEnabled
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.y / height);
                    setCurrentVideoId(videoData[index]?.id);
                }}
            />
            {/* Sticky progress bar */}
            <View style={styles.stickyProgressBarContainer}>
                <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
            </View>


            {/* Modal for Comment Section */}
            <Modal
                visible={commentModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setCommentModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Add a comment..."
                            placeholderTextColor="black"

                            value={currentComment}
                            onChangeText={setCurrentComment}
                            multiline
                        />
                        <Pressable onPress={handleCommentSubmit} style={styles.submitButton}>
                            <Text style={styles.submitText}>Submit</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const VideoItem = ({ item, currentVideoId, onProgressUpdate, videoRef, onPause, onPlay, isPaused, onLikePress, isLiked, onCommentPress, comments, scaleAnim }) => {
    const { width } = Dimensions.get('window');
    const videoHeight = width * (16 / 9); // Adjust for aspect ratio
    const [bookmark, setBookMark] = useState('')
    // const [isPaused, setIsPaused] = useState(false);

    // Handle toggle on video tap
    const togglePlayPause = () => {
        setIsPaused(!isPaused);
    };

    const handleProgress = (data) => {
        if (data.seekableDuration > 0) {
            const progressPercent = data.currentTime / data.seekableDuration;
            if (item.id === currentVideoId) {
                onProgressUpdate(progressPercent); // Update sticky progress bar for the current video
            }
        }
    };

    // console.log(item);

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `This is the video number ${item.id}`,
                url: item.url

            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    return (
        <View style={styles.videoContainer}>

            <View style={{ width: '100%', height: videoHeight, justifyContent: 'center' }}>
                <Pressable onPress={() => (isPaused ? onPlay() : onPause())} style={{ width: '100%', height: videoHeight }}>
                    <Video
                        ref={videoRef}
                        source={item.url}
                        style={{ width: width, height: videoHeight }}
                        resizeMode="contain" // This preserves the aspect ratio
                        repeat
                        paused={currentVideoId !== item.id || isPaused}
                        onProgress={handleProgress}


                    />
                    {isPaused && <Icon name={"play"} size={50} color='white' style={{ position: 'absolute', alignSelf: 'center', top: '50%' }} />}

                </Pressable>
                {/* Like Button */}
                <Pressable
                    onPress={() => onLikePress(item.id)}
                    style={styles.likeButton}
                >
                    <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
                        <Icon
                            name={"heart"}  // Filled or empty heart depending on like state
                            size={35}
                            color={isLiked ? 'red' : 'white'}
                        />
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>100</Text>
                    </Animated.View>
                </Pressable>

                {/* Comment Button */}
                <Pressable onPress={() => onCommentPress(item.id)} style={styles.commentButton}>
                    <Icon name="reader" size={30} color="white" />
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>100</Text>
                </Pressable>

                {/* Comments List */}
                <View style={styles.commentsContainer}>
                    {comments.map((comment, index) => (
                        <Text key={index} style={styles.commentText}>
                            {comment}
                        </Text>
                    ))}
                </View>

                {/* Bookmark Button */}
                <Pressable onPress={() => setBookMark(!bookmark)} style={styles.bookmarkButton}>
                    <Icon name="bookmark" size={30} color={bookmark ? 'yellow' : "white"} />
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>100</Text>
                </Pressable>

                {/* Bookmark Button */}
                <Pressable onPress={onShare} style={styles.shareButton}>
                    <Icon name="arrow-redo" size={30} color={"white"} />
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>100</Text>
                </Pressable>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black', alignItems: 'center' },
    videoContainer: { marginVertical: 20, alignItems: 'center' },
    progressBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#d3d3d3', // Background color of the progress bar
    },
    stickyProgressBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#d3d3d3',
        zIndex: 2, // Ensure the progress bar stays on top
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#ff0000',
    },
    likeButton: {
        position: 'absolute',
        bottom: '50%',
        right: 20,
        zIndex: 1,
    },

    commentsContainer: {
        position: 'absolute',
    },
    commentButton: {
        position: 'absolute',
        bottom: '40%',
        right: 20,
        zIndex: 1,
        alignItems: 'center'
    },
    bookmarkButton: {
        position: 'absolute',
        bottom: '30%',
        right: 20,
        zIndex: 1,
        alignItems: 'center'
    },
    shareButton: {
        position: 'absolute',
        bottom: '20%',
        right: 20,
        zIndex: 1,
        alignItems: 'center'
    },
    commentsContainer: {
        position: 'absolute',
        bottom: 120,
        left: 20,
        right: 20,
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 10,
        borderRadius: 10,
    },
    commentText: {
        color: 'white',
        fontSize: 14,
        marginBottom: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    commentInput: {
        height: 100,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        textAlignVertical: 'top',
        color: 'black'
    },
    submitButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    submitText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});


