
import Slider from '@react-native-community/slider';
import { StyleSheet, Text, TextInput, View, StatusBar, Platform,
    ScrollView, ActivityIndicator, TouchableOpacity, Alert, Keyboard } from 'react-native';

import { useState } from 'react';
const statusBarAltura = StatusBar.currentHeight // Pegar o tamanho no android, caso for IOS irá mostra como Undefinid


export default function App() {
  // UseStates
  const [dias, setDias] = useState(3)
  const [cidade, setCidade] = useState('')
  const [loading, setLoading] = useState(false);
  const [viagem, setViagem] = useState('')
  const [geminiApiKey,setGeminiApiKy] = useState('') // Link para gerar sua api https://aistudio.google.com/app/apikey/?utm_source=website&utm_medium=referral&utm_campaign=Alura&utm_content=
 
  const textoDaBuscarNaIA = `Crie um roteiro para uma viagem de exatos ${dias.toFixed(0)} dias na cidade de ${cidade}, busque por lugares turisticos, lugares mais visitados, seja preciso nos dias de estadia fornecidos e limite o roteiro apenas na cidade fornecida. Forneça apenas em tópicos com nome do local onde ir em cada dia.`
  
  // Funções  para Gerar uma Roteiro de viagem
  async function gerarRoteiro() {
    // Verifico se existe informações para buscar, caso não tenha irei mostrar um alerta para o usuario
      if(cidade ===''){
        Alert.alert('Atenção!', 'Preencha o nome da cidade!')
        return;
      }

      if(geminiApiKey === '' || geminiApiKey === null){
         Alert.alert('Atenção!', 'Preencha os dados da sua API Key')
         return
      } 
      // Antes realizar a buscar ire mudar o estado do loading para mostra animação de carregamento
      setViagem('')
      setLoading(true);
      Keyboard.dismiss();

      

      fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,{
        method:'POST',
        headers:{
          "Content-Type": "application/json",         

        },
        body: JSON.stringify({         
          contents : [
            {
              parts: [
                {
                  text: textoDaBuscarNaIA
                }
              ]
              
            }
          ],
          safetySettings: [
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_ONLY_HIGH"
            }
        ],
        generationConfig: {
            stopSequences: [
                "Title"
            ],
            temperature: 1.0,
                 
        }
        })
      })
      .then(resposta => resposta.json())
      .then((dado) =>{
          console.log(dado)
          setViagem(dado.candidates[0].content.parts[0].text)
      })  
      .catch((error) =>{
        console.log(error)
      })
      .finally(() =>{
        setLoading(false)
      })
  }


  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.titulo}>Roteiros De Viagens</Text>
      <View style={styles.formulario}>
      <Text style={styles.subTitulo}> Informe sua API Key do GEMINI</Text>
      <TextInput
          placeholder='Ex: AIzaSyBvjlMbU_Mm3o7l4pA8vI7xNKLkdOJHlu8'
          style={styles.input}
          value={geminiApiKey}
          onChangeText={(texto) => setGeminiApiKy(texto)}
        />
        <Text style={styles.subTitulo}>Cidade destino</Text>
        <TextInput
          placeholder='Ex: Campo Grande, MS'
          style={styles.input}
          value={cidade}
          onChangeText={(texto) => setCidade(texto)}
        />

        <Text style={styles.subTitulo}>Tempo de estadia : <Text style={styles.dias}>{dias.toFixed()}</Text></Text>

        <Slider
          minimumValue={1} // valor minimo
          maximumValue={10} // valor maximo
          minimumTrackTintColor="#CF222E" // cor da esquerda
          maximumTrackTintColor="#000000" // cor da direita
          value={dias} // numero que será atribuido
          onValueChange={(valor) => setDias(valor)} // Valor de dias
        />

      </View>


      <TouchableOpacity
        style={styles.botao}
        onPress={() => gerarRoteiro()}
      >
        <Text style={styles.botaoText}> Gerar roteiros de viagem 👇 </Text>
      
      </TouchableOpacity>

      <ScrollView
        style={styles.conteudoScroll} // Estilo do ScrollView
        showsVerticalScrollIndicator={false} // tirando o scroll vertical 
        contentContainerStyle={{ paddingBottom: 18, marginTop: 4 }} // Espaçamento quando chega na ultima linha do texto
      >

        {loading && ( // Caso o loading estiver true irá renderizar o loading
          <View
            style={styles.conteudo} // Estilo da View
          >
            <Text style={styles.conteudoTitulo}>Carregando roteiro! </Text>
            <ActivityIndicator color='#000' size='large' />
          </View>
        )}
        {viagem && ( // Caso tenha alguma informação a view do conteudo irá aparecer, caso não tenha não irá
          <View
            style={styles.conteudo} // Estilo da View
          >
            <Text style={styles.conteudoTitulo}>Aqui esta a sugestão da sua viagem 👇 </Text>
            <Text
              style={styles.conteudoTexto}>

              {viagem}

            </Text>
          </View>
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    paddingTop: 20
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? statusBarAltura : 54 // Aqui estou verificando em qual plataforma ele esta, se tiver no android ira pegar o valor da Status bar, caso for IO irá gerar um valor de 54 
  },
  formulario: {
    backgroundColor: '#FFF',
    width: '90%', // Obs trabalhar com porcentam garante a responsividade. 
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 8
  },
  subTitulo: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#94a3b8',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,

  },
  dias: {
    backgroundColor: '#F1F1F1'
  },
  botao: {
    backgroundColor: '#FF5656',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    padding: 8,
    borderRadius: 8
  },
  botaoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF'
  },
  conteudoScroll: {
    width: '90%'
  },
  conteudo: {
    backgroundColor: '#FFF',
    padding: 16,
    width: '100%',
    marginTop: 16,
    borderRadius: 8,

  },
  conteudoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,

  }
});
