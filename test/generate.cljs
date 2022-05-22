(ns test.generate
  (:require [cljs.test :as t :refer [deftest is testing]]
            [scripts.generate :as generate]))

(deftest yaml-merge-test
  (let [yaml (generate/yaml-merge
              #js ["./test/testdata/1.yml"
                   "./test/testdata/2.yml"])]
    (testing "merge 2 files check keys/value"
      (is (= (:first #js {:first 1})
             (:first yaml)))
      (is (= (:last #js {:last 2})
             (:last yaml))))

    (testing "count keys"
      (is (= 2
             (count (js-keys yaml)))))))

(deftest make-theme-test
  (doseq [theme (list "base" "coffee" "gradient")]
    (let [monotropic (js->clj
                      (js/Object (.-monotropic (generate/make-theme theme))))]
      (testing "check monotropic keys"
        (is (= ["base" "ansi" "brightOther" "other"]
               (keys monotropic))))
      (testing "count monotropic->base keys"
        (is (= 11
               (count (get monotropic "base"))))))))

;; print name of each test
(defmethod t/report [:cljs.test/default :begin-test-var] [m]
  (println "===" (-> m :var meta :name))
  (println))

(defn -main []
  (t/run-tests 'test.generate))
