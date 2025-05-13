import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Settings, Bell, VolumeX, Volume2, CircleHelp as HelpCircle, List, Languages, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { resetGameProgress } from '@/utils/database';

export default function SettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [language, setLanguage] = useState('es');
  
  const handleResetData = () => {
    Alert.alert(
      'Reiniciar Datos',
      '¿Estás seguro que deseas reiniciar todos tus datos? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar',
          style: 'destructive',
          onPress: async () => {
            await resetGameProgress();
            Alert.alert('Datos Reiniciados', 'Todos tus datos han sido reiniciados correctamente.');
          },
        },
      ]
    );
  };

  const showAboutInfo = () => {
    Alert.alert(
      'Acerca de Adivina el Número',
      'Versión 1.0.0\n\nAdivina el Número es un juego de adivinanza con múltiples niveles y dificultades. Desarrollado para poner a prueba tu intuición y habilidades mentales.\n\n© 2025 Todos los derechos reservados.'
    );
  };

  const showHelpInfo = () => {
    Alert.alert(
      'Cómo Jugar',
      '1. Selecciona una dificultad: Fácil, Intermedio o Difícil.\n\n2. En cada nivel, intenta adivinar el número secreto con la menor cantidad de intentos posible.\n\n3. Después de cada intento, recibirás pistas si tu número es mayor o menor que el número secreto.\n\n4. Completa todos los niveles de una dificultad para desbloquear la siguiente.\n\n5. ¡Acumula puntos y desbloquea logros!'
    );
  };

  const selectLanguage = () => {
    Alert.alert(
      'Seleccionar Idioma',
      'Elige tu idioma preferido:',
      [
        {
          text: 'Español',
          onPress: () => setLanguage('es'),
        },
        {
          text: 'English',
          onPress: () => {
            Alert.alert('Próximamente', 'El idioma inglés estará disponible en futuras actualizaciones.');
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#6A5ACD', '#9370DB']}
        style={styles.header}
      >
        <Settings size={48} color="#FFFFFF" />
        <Text style={styles.headerTitle}>Ajustes</Text>
      </LinearGradient>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Preferencias</Text>
        
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            {soundEnabled ? (
              <Volume2 size={24} color="#6A5ACD" />
            ) : (
              <VolumeX size={24} color="#9E9E9E" />
            )}
            <Text style={styles.settingText}>Sonidos</Text>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#E0E0E0', true: '#6A5ACD' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <Bell size={24} color={notificationsEnabled ? '#6A5ACD' : '#9E9E9E'} />
            <Text style={styles.settingText}>Notificaciones</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E0E0E0', true: '#6A5ACD' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <Languages size={24} color="#6A5ACD" />
            <Text style={styles.settingText}>Idioma</Text>
            <TouchableOpacity onPress={selectLanguage}>
              <Text style={styles.languageText}>
                {language === 'es' ? 'Español' : 'English'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Ayuda y Soporte</Text>
        
        <View style={styles.settingCard}>
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={showHelpInfo}
          >
            <HelpCircle size={24} color="#6A5ACD" />
            <Text style={styles.settingText}>Cómo Jugar</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={showAboutInfo}
          >
            <Info size={24} color="#6A5ACD" />
            <Text style={styles.settingText}>Acerca de</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Datos</Text>
        
        <View style={styles.settingCard}>
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={handleResetData}
          >
            <List size={24} color="#F44336" />
            <Text style={[styles.settingText, { color: '#F44336' }]}>
              Reiniciar Datos
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  settingsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 16,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 12,
  },
  languageText: {
    fontSize: 16,
    color: '#6A5ACD',
    fontWeight: 'bold',
  },
});