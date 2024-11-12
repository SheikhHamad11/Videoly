import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    ImageBackground,
} from 'react-native';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const MyFlatList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const isMounted = useRef(true); // For cleanup check

    // Function to fetch data from API
    const fetchData = async pageNum => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}?_page=${pageNum}&_limit=10`);
            const result = await response.json();

            if (isMounted.current) {
                setData(prevData => [...prevData, ...result]);
                setHasMore(result.length > 0); // If we get less data, it means there are no more pages
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    // Fetch data on component mount and page change
    useEffect(() => {
        fetchData(page);

        // Cleanup function to handle async API call cancellation
        return () => {
            isMounted.current = false;
        };
    }, [page]);

    // Function to fetch more data (for pagination)
    const loadMoreData = () => {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    // Sticky header component
    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.headerText}>Flat List Header</Text>
        </View>
    );

    // Footer loader component
    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    };

    return (
        <ImageBackground
            source={require('../../src/assets/img.jpg')}
            style={{ flex: 1 }}
            resizeMode="cover">
            <FlatList
                data={data}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={{ color: 'black' }}>{item.body}</Text>
                    </View>
                )}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.5} // Fetch more data when the user scrolls halfway through the list
                stickyHeaderIndices={[0]} // Sticky header for the first item (header)
            />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: 16,
        backgroundColor: 'skyblue',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
    },
    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    footer: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MyFlatList;
