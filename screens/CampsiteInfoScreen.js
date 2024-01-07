import {
    FlatList, StyleSheet, Text,
    View, Modal, Pressable
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import RenderCampsite from '../features/campsites/RenderCampsite';
import { toggleFavorite } from '../features/favorites/favoritesSlice';
import { postComment } from '../features/comments/commentsSlice';
import { Rating } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';


const CampsiteInfoScreen = ({ route }) => {
    const { campsite } = route.params;
    const comments = useSelector((state) => state.comments);
    const favorites = useSelector((state) => state.favorites);
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(false);

    const [rating, setRating] = useState(5);
    const [author, setAuthor] = useState('');
    const [text, setComment] = useState('');

    const handleSubmit = () => {
        const newComment = {
            author,
            rating,
            text,
            campsiteId: campsite.id
        };
        console.log('newComment:', newComment);
        dispatch(postComment(newComment));
        setShowModal(!showModal);
    };

    const resetForm = () => {
        setRating(5);
        setComment('');
        setAuthor('')
    };

    const renderCommentItem = ({ item }) => {
        return (
            <View style={styles.commentItem}>
                <Text style={{ fontSize: 14 }}>{item.text}</Text>
                <Rating style={{ alignItems: 'flex-start', paddingVertical: '5%' }}
                    startingValue={item.rating}
                    imageSize={10}
                    readonly
                    ></Rating>
                <Text style={{ fontSize: 12 }}>
                    {`-- ${item.author}, ${item.date}`}
                </Text>
            </View>
        );
    };

    return (
        <FlatList
            data={comments.commentsArray.filter(
                (comment) => comment.campsiteId === campsite.id
            )}
            renderItem={renderCommentItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
                marginHorizontal: 20,
                paddingVertical: 20
            }}
            ListHeaderComponent={
                <>
                    <RenderCampsite
                        campsite={campsite}
                        isFavorite={favorites.includes(campsite.id)}
                        showModal={!showModal}
                        markFavorite={() => dispatch(toggleFavorite(campsite.id))}
                        onShowModal={() => setShowModal(!showModal)}
                    >
                    </RenderCampsite>                    
                    <Text style={styles.commentsTitle}>Comments</Text>
                    <Modal
                        animationType='slide'
                        transparent={false}
                        visible={showModal}
                        onRequestClose={() => setShowModal(!showModal)}
                    >
                        <View style={styles.modal} >
                            <Rating
                                type='star'
                                startingValue={rating}
                                ratingCount={5}
                                imageSize={40}
                                showRating
                                onFinishRating={(rating) => setRating(rating)} 
                                style={{ paddingVertical: 10 }}
                            ></Rating>
                            <View style={{
                                margin: 10
                            }}>
                                <Input
                                    placeholder='Your Name'
                                    leftIconContainerStyle={{paddingRight:10}}
                                    onChangeText={(author) => setAuthor(author)}
                                    leftIcon={
                                        <Icon
                                            name='user-o'
                                            size={24}
                                            color='black'
                                        />
                                    }
                                />
                                <Input
                                    placeholder='Comment'
                                    leftIconContainerStyle={{ paddingRight: 10 }}
                                    onChangeText={(comment) => setComment(comment)}
                                    leftIcon={
                                        <Icon
                                            name='comment-o'
                                            size={24}
                                            color='black'
                                        />
                                    }
                                />
                                <View style={{
                                    margin: 10
                                }}>
                                    <Pressable
                                        style={styles.submitStyleButton}                                       
                                        onPress={() => {
                                            handleSubmit();
                                            resetForm();
                                        }}
                                    >
                                        <Text style={styles.buttonText}>{'SUBMIT'}</Text>
                                    </Pressable>
                                </View>     
                                <View style={{
                                    margin: 10
                                }}>
                                    <Pressable
                                        style={styles.chrisStyleButton}
                                        onPress={() => {
                                            resetForm();
                                            setShowModal(!showModal)
                                        }}
                                    >
                                        <Text style={styles.buttonText}>{'CANCEL'}</Text>
                                    </Pressable>
                                </View> 
                            </View>
                        </View>

                    </Modal>
                </>
            }
        >

        </FlatList>
    );
};

const styles = StyleSheet.create({
    commentsTitle: {
        textAlign: 'center',
        backgroundColor: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#43484D',
        padding: 10,
        paddingTop: 30
    },
    commentItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff'
    },
    modal: {
        margin: 40,
        justifyContent: 'center'
    },
    chrisStyleButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#808080'
    },
    submitStyleButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#5637DD',
        paddingBottom: 10
    },
    buttonText: {
        color: 'white'
        
    }
});

export default CampsiteInfoScreen;