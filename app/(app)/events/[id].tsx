// app/(app)/events/[id].tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../../../types/event';

export default function EventDetailScreen() {
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const params = useLocalSearchParams();
    const eventId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

    useEffect(() => {
        fetchEvent();
    }, [eventId]);

    const fetchEvent = async () => {
        try {
            const eventDoc = await getDoc(doc(db, 'events', eventId));
            if (eventDoc.exists()) {
                setEvent({ id: eventDoc.id, ...eventDoc.data() } as Event);
            }
        } catch (error) {
            console.error('Error fetching event:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Eliminar Evento",
            "¿Estás seguro de que deseas eliminar este evento?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'events', eventId));
                            router.push('/events');
                        } catch (error) {
                            console.error('Error deleting event:', error);
                            Alert.alert('Error', 'No se pudo eliminar el evento');
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (!event) {
        return (
            <View style={styles.container}>
                <Text>Evento no encontrado</Text>
            </View>
        );
    }

    const isEventCreator = event.createdBy === auth.currentUser?.uid;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                </TouchableOpacity>

                {isEventCreator && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => {
                                console.log('Navigating to event:', eventId);
                                router.push({
                                    pathname: `events/edit/[id]`,
                                    params: { id: eventId }
                                } as any);
                            }}
                        >
                            <Ionicons name="pencil" size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={handleDelete}
                        >
                            <Ionicons name="trash" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>{event.title}</Text>

                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={20} color="#666" />
                        <Text style={styles.infoText}>
                            {new Date(event.date).toLocaleDateString()}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={20} color="#666" />
                        <Text style={styles.infoText}>{event.location}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="people-outline" size={20} color="#666" />
                        <Text style={styles.infoText}>
                            {event.attendees?.length || 0} asistentes
                        </Text>
                    </View>
                </View>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionLabel}>Descripción</Text>
                    <Text style={styles.descriptionText}>{event.description}</Text>
                </View>
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => {
                            console.log('Navigating to event:', eventId);
                            router.push({
                                pathname: `events/edit/[id]`,
                                params: { id: eventId }
                            } as any);
                        }}
                    >
                        <Text style={styles.asistir}>Asistir</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 8,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    editButton: {
        backgroundColor: '#007AFF',
        padding: 8,
        borderRadius: 8,
    },
    deleteButton: {
        backgroundColor: '#ff3b30',
        padding: 8,
        borderRadius: 8,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    infoContainer: {
        backgroundColor: '#f8f8f8',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
    },
    descriptionContainer: {
        backgroundColor: '#f8f8f8',
        padding: 16,
        borderRadius: 8,
    },
    descriptionLabel: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    asistir: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
});