if ! command -v docker &> /dev/null
then
    echo "❌ Docker no está instalado. Por favor, instala Docker para ejecutar este script."
    exit 1  # Sale del script con un código de error
fi

if ! docker ps -a | grep -q postgres_container; then
    echo "🔨 Iniciando PostgreSQL en Docker..."
    docker run --name postgres_container -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=mydb -p 5432:5432 -d postgres
else
    echo "✅ PostgreSQL ya está corriendo en Docker"
fi

# ---------------------------
# Configuración del Backend
# ---------------------------

echo "🔨 Configurando el backend..."

cd backend/core

# Crear archivo .env para el backend
cat > .env <<EOF
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/mydb?schema=public"
BACKEND_PORT=3000
ACCESS_TOKEN_SECRET=d22e75e7a1606fbf4383ededc77b6b5a0b65bfc2d117bc444d01ed1b1a78efec1522331ac78de2e669287f3a5c63b69b2180a2965041b1125f5b67bd70d829eca8c852657628186fc23698eb380c4d0ada4c6c4e931eab9ce98258c0c896afcbf2e702614967f5125f413cdd17c7d8d7170f0b09dd73fb7e3f361c1185aa53204cf08dd9a8495c21b1f8c4442e1c29b02675f51dee541935574eb521ea370179c4ff5bc338dfb5b4927784ca31b47c8364a8562f2ce111ff0df1cc41d7cb473429491d1336a693c2e325e338f5f8e80fc7909d58c441fc5ed22c3f72a19db48f6430c457dc4a408b623a62639ac6e279c2246e627b815a600ba6982ad060b19d
REFRESH_TOKEN_SECRET=a11029d82b6d4fa8053675b34531ab72c8c5b9539615b4c2d56eae045bae634272f0daf4908e302ae583af9ebf1b68330e594847e5212a4ab0b3034b1360db5eb9e487c4d25162e463c12bad94f6435ea19b1515f8f1a0921283f3178c6ab48ace38d0495f53a1b957f3041049caef14226ce79b3d18b85f719fde622a566b08641562624a738988e8a6cc3f19e5c52e92640965edd39c2aaad38de277eb5e93e60fb5df34614963497e6dbf4f08b86f225b97c781ae72880b0143f01ee64550d706dc5d02cdbcbcca080a1f6e04836adf7270428eb129fecd286c0e43e7148ca5e5b19f285a8ea05044c41bd2bf431eb4fc7070c6518d1fd2d3f130862bf8fb
FRONTEND_ORIGINS=http://localhost:5173
EOF

# Instalar dependencias y ejecutar migraciones
echo "📦 Instalando dependencias del backend..."
npm install

echo "🔄 Ejecutando migraciones de Prisma..."
npx prisma generate
npx prisma migrate dev --name init

# Ejecutar el script de mocks
echo "🌱 Ejecutando script para poblar la base de datos con datos de prueba..."
npx ts-node src/scripts/mocks.ts

# Iniciar el servidor backend en segundo plano
echo "🚀 Iniciando servidor backend..."
npm run dev &

cd ../../

# ---------------------------
# Configuración del Frontend
# ---------------------------

echo "🔨 Configurando el frontend..."

cd frontend

# Crear archivo .env para el frontend
cat > .env <<EOF
VITE_BACKEND_URL=http://localhost:3000
EOF

# Instalar dependencias
echo "📦 Instalando dependencias del frontend..."
npm install

# Iniciar el servidor frontend
echo "🚀 Iniciando servidor frontend..."
npm run dev

cd ..
