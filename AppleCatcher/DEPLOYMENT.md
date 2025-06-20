# 배포 가이드

이 프로젝트를 다양한 플랫폼에 배포하는 방법을 설명합니다.

## 1. Vercel 배포 (권장)

Vercel은 Node.js 풀스택 앱을 쉽게 배포할 수 있습니다.

### 단계:
1. GitHub에 코드 업로드
2. [Vercel](https://vercel.com) 계정 생성
3. GitHub 저장소 연결
4. 환경변수 설정:
   - `DATABASE_URL`: PostgreSQL 연결 문자열
5. 배포 완료

### 데이터베이스:
- [Neon](https://neon.tech) (PostgreSQL) 무료 계층 사용 권장
- 또는 [Supabase](https://supabase.com) PostgreSQL

## 2. Netlify 배포

프론트엔드 중심이지만 서버리스 함수로 백엔드도 지원합니다.

### 단계:
1. GitHub에 코드 업로드
2. [Netlify](https://netlify.com) 계정 생성
3. GitHub 저장소 연결
4. 빌드 설정 확인 (netlify.toml 사용)
5. 환경변수 설정
6. 배포 완료

## 3. Railway 배포

간단한 풀스택 배포 플랫폼입니다.

### 단계:
1. [Railway](https://railway.app) 계정 생성
2. GitHub 저장소 연결
3. PostgreSQL 데이터베이스 추가
4. 환경변수 자동 설정
5. 배포 완료

## 4. Heroku 배포

### 단계:
1. [Heroku](https://heroku.com) 계정 생성
2. Heroku CLI 설치
3. 프로젝트에 Procfile 추가:
   ```
   web: npm start
   ```
4. PostgreSQL 애드온 추가:
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```
5. 배포:
   ```bash
   git push heroku main
   ```

## 5. Digital Ocean App Platform

### 단계:
1. GitHub에 코드 업로드
2. Digital Ocean 계정 생성
3. App Platform에서 새 앱 생성
4. GitHub 저장소 연결
5. PostgreSQL 데이터베이스 추가
6. 환경변수 설정
7. 배포 완료

## 환경변수 설정

모든 플랫폼에서 다음 환경변수가 필요합니다:

```
DATABASE_URL=postgresql://username:password@host:port/database
PORT=5000
NODE_ENV=production
```

## 데이터베이스 초기화

배포 후 데이터베이스 테이블을 생성해야 합니다:

```bash
npm run db:push
```

## 도메인 연결

대부분의 플랫폼에서 커스텀 도메인을 연결할 수 있습니다:

1. 플랫폼 설정에서 도메인 추가
2. DNS 설정에서 CNAME 또는 A 레코드 추가
3. SSL 인증서 자동 설정

## 모니터링

- **Vercel**: 내장 분석 및 로그
- **Netlify**: 내장 분석
- **Railway**: 내장 메트릭
- **Heroku**: Heroku Metrics (유료)

## 비용

- **Vercel**: 개인 프로젝트 무료, 상업적 사용 월 $20
- **Netlify**: 월 300분 빌드 시간 무료
- **Railway**: 월 $5 크레딧 제공
- **Heroku**: 취미 앱 월 $7
- **Digital Ocean**: 월 $5부터

추천: 개인 프로젝트는 **Vercel + Neon**, 상업적 프로젝트는 **Railway** 또는 **Digital Ocean**