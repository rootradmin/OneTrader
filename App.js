// OneTrader - Expo React Native Trade Not Uygulaması // Ana dosya: App.js

import React, { useState, useEffect } from 'react'; import { Text, View, FlatList, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native'; import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('onetrader.db');

export default function App() { const [trades, setTrades] = useState([]); const [pair, setPair] = useState(''); const [entry, setEntry] = useState(''); const [exit, setExit] = useState(''); const [note, setNote] = useState(''); const [modalVisible, setModalVisible] = useState(false);

useEffect(() => { db.transaction(tx => { tx.executeSql( 'CREATE TABLE IF NOT EXISTS trades (id INTEGER PRIMARY KEY AUTOINCREMENT, pair TEXT, entry REAL, exit REAL, note TEXT);' ); }); fetchTrades(); }, []);

const fetchTrades = () => { db.transaction(tx => { tx.executeSql('SELECT * FROM trades;', [], (_, { rows }) => { setTrades(rows._array); }); }); };

const addTrade = () => { if (!pair || !entry || !exit) return Alert.alert('Lütfen tüm alanları doldurun.');

db.transaction(tx => {
  tx.executeSql('INSERT INTO trades (pair, entry, exit, note) VALUES (?, ?, ?, ?);', [pair, entry, exit, note],
    () => {
      fetchTrades();
      setModalVisible(false);
      setPair(''); setEntry(''); setExit(''); setNote('');
    });
});

};

return ( <View style={styles.container}> <Text style={styles.title}>OneTrader'a Hoş Geldin, Mukadder</Text>

<FlatList
    data={trades}
    keyExtractor={item => item.id.toString()}
    renderItem={({ item }) => (
      <View style={styles.tradeItem}>
        <Text style={styles.tradeText}>{item.pair} | Giriş: {item.entry} | Çıkış: {item.exit}</Text>
        <Text style={styles.noteText}>Not: {item.note}</Text>
      </View>
    )}
  />

  <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
    <Text style={styles.addButtonText}>+ Yeni Trade</Text>
  </TouchableOpacity>

  <Modal visible={modalVisible} animationType="slide">
    <View style={styles.modalContent}>
      <TextInput placeholder="Pair" value={pair} onChangeText={setPair} style={styles.input} />
      <TextInput placeholder="Giriş Fiyatı" value={entry} onChangeText={setEntry} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Çıkış Fiyatı" value={exit} onChangeText={setExit} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Not" value={note} onChangeText={setNote} multiline style={styles.input} />

      <TouchableOpacity style={styles.saveButton} onPress={addTrade}>
        <Text style={styles.saveButtonText}>Kaydet</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setModalVisible(false)}>
        <Text style={{ color: 'red', marginTop: 10 }}>İptal</Text>
      </TouchableOpacity>
    </View>
  </Modal>
</View>

); }

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#121212', padding: 20 }, title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 10 }, tradeItem: { backgroundColor: '#1e1e1e', padding: 10, marginBottom: 10, borderRadius: 8 }, tradeText: { color: '#fff' }, noteText: { color: '#888', fontStyle: 'italic' }, addButton: { backgroundColor: '#2196F3', padding: 15, borderRadius: 10, alignItems: 'center' }, addButtonText: { color: '#fff', fontSize: 16 }, modalContent: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#121212' }, input: { backgroundColor: '#1e1e1e', color: '#fff', padding: 10, marginBottom: 10, borderRadius: 6 }, saveButton: { backgroundColor: '#2196F3', padding: 15, borderRadius: 10, alignItems: 'center' }, saveButtonText: { color: '#fff', fontSize: 16 } });

