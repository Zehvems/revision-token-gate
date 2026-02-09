# Revision Token Gate — Post-Mortem / Lessons Learned

Status: Mid-validation (leaning FREEZE/KILL)
Okres: 05.01.2026 → 02.2026
Autor: Maks
Core idea: kontrolowanie liczby poprawek (revision rounds) w projektach copywriterskich / freelance.

## 1. TL;DR

Pierwsze pełne MVP dowiezione od zera do działającego systemu (build → deploy → walidacja), które nie jest painkillerem dla rynku, ale dało ogromny skok kompetencyjny w backendzie, procesie i realnym myśleniu produktowym.
Pierwszy realny system z bazą danych na stacku: "neon, prisma, next.js, react".
Pierwsze realne zderzenie z rynkiem.

**Produkt myślał w języku:**
rund
limitów

**Rynek myśli w języku:**
„klient marudzi”
„drobne poprawki”

## 2. Co działało

Twardy scoupe, zero straconego czasu, każda rzecz dużo mnie nauczyła.
Sposób walidacji i jej optymalność.
Zrozumienie backendu (w jakims stopniu).
Thunder Client.

## 3. Co się posypało

Chaos w strukturze plików.
Zaczęcie z starszą wersją prisma.
Nieregularność i opóźnienia z projektem.
Średnia zależność od platformy (facebok).
Złe zrozumienie rynku.
fetch w Server Components bez cookies - najtrudniejszy bug.

## 4. Co było waste

Zaczęcie z SQLite, po częsci było wastem, jednak do developmentingu nie była to najgrosza decyzja gdyż przeniesienie zajęło chwile.
Z jednej strony wastem było zaczęcice z MVP, bez researchu, możliwe że gdybym wczesniej zaczał badać grupki i fora copywriterów, dowiedziałbym się więksozsci info którego sie dowiedziałem po 0.1, jednak chodziło tu o pełny przepływ więc nie mam do tego żalu.

## 5. Co było game-changerem

Zmienienie bazy na neon, i pierwszy hosting na Vercel.
Głownym gamechenderem było zrozumienie sensu bazy danych, endpointów i podstaw next.js.
Zrozumiałem, że nie każdy ból = painkiller.

## 6. Co bym zrobił inaczej

1. Lepsze dobranie bólu
   **Problem emocjonalny > systemowy**
   Ludzie: myślą relacyjnie nie procesowo
   Produkt jest: systemowy
   To tworzy tarcie."
2. Jescze szybciej dowióźł core.
3. Troche szybsze wyjście do ludzi...

## 7. Najważniejsze lekcje o sobie:

1. Dowóz > nauka.
2. Tempo jest realnym skillem, ten sam projekt można zrobić w 30h albo 5h. (to zmienia całe życie)
3. Pierwsze MVP nie buduje firmy.
   Buduje: sposób myślenia, tempo, zdolność kończenia rzeczy.

## 8. Odpowiedzi na 2 najwazniejsze pytania po tym projekcie

**1️⃣ Gdybym zaczynał projekt drugi raz — co zrobiłbym inaczej**
Od razu postawiłbym prostą bazę na SQLite + Prisma, bez długiego zastanawiania się nad technologią. Z perspektywy czasu wiem, że to był właściwy wybór i że późniejsze przeniesienie na Neon było proste i szybkie.

Skupiłbym się tylko na trzech rzeczach:
modele danych (Project / Request),
jedna instancja Prismy,
jeden działający endpoint (create + fetch).
Bez teorii, bez kombinowania.
Myślę, że to, co zajęło mi 4–5 dni, dziś byłbym w stanie dowieźć w 2 mocne dni, bo największym spowolnieniem był szum w głowie i niepewność, a nie brak umiejętności.
Największa zmiana: szybciej przejść od „rozumienia” do „robienia”.

**2️⃣ Co było największym realnym ograniczeniem: skill, czas czy chaos?**

Największym ograniczeniem nie był skill ani czas.
To był chaos decyzyjny.
**Na początku:**
nie rozumiałem po co mi baza,
nie wiedziałem czym naprawdę jest Prisma,
nie wiedziałem, że to inwestycja na lata.
**Przez to:**
dużo rzeczy robiłem freestyle,
uczyłem się narzędzi w trakcie pisania kodu,
nie miałem jasnej mapy projektu.
**Dzisiaj wiem, że ogromnie pomogłoby:**
narysowanie na kartce prostego schematu systemu,
określenie etapu projektu,
wiedzenie „co piszę teraz i po co”.
To by zmniejszyło chaos i przyspieszyło pracę.

## A) Evidence / Dane

ilu ludzi widziało posty: około 50
ile było komentarzy/DM : 3 osoby komentujące
ile rozmów 1:1: 0
ile klików w landing: 0
ile zapisów: 0
ile osób zgodziło się przetestować: 0

## B) Top 10 cytatów z rynku

1. "ufam intuicji:) tu górę bierze komponent emocjonalny postawy wobec etyki zawodowej "

2. C) Segmenty i kanały
   gdzie testowałeś (grupy, jakie):
   Post na jednej grupie z dyskusjami, i research na innych, dodatkowo post na linkedlin.

   kto odpowiadał (juniorzy/seniorzy/agencje): seniorzy i midy, różne typy osób kryjące ból emocjami intuicją i stawkami.

jakie były różnice między segmentami. Segment premimium tamował ból pieniędzmi, segment zwykły wstydził się zmieniać nawyków, a segment półprofesionalny traktował to jako część pracy.

D) Dlaczego to nie „painkiller” (hipotezy):

relacyjny wstyd,

rozwiązują to ceną, nie procesem,

tool fatigue.
