(ns generate
  (:require ["fs" :as fs]
            ["js-yaml" :refer [DEFAULT_SCHEMA load Type]]))

(def yaml-with-alphatype
  "Returns a function that will parse a yaml file and return a map of"
  (new Type
       "!alpha"
       #js {:kind "sequence",
            :construct (fn [[hexRGB alpha]] (+ hexRGB alpha)),
            :represent (fn [[hexRGB alpha]] (+ hexRGB alpha))}))

(def schema (.extend DEFAULT_SCHEMA #js [yaml-with-alphatype]))

(defn yaml-merge
  "Merge any yaml files"
  [files]
  (let [merged (atom "")]
    (.forEach files
              (fn [file]
                (reset! merged (str @merged (.readFileSync fs file "utf8")))))
    (load @merged #js {:schema schema})))

(defn make-theme
  "Generate a theme based on yaml files"
  [name]
  (let [theme (yaml-merge
               #js [(str "src/" name ".yml")
                    "src/monotropic.yml"])]
    (doseq [key (.keys js/Object (.-colors theme))]
      #_{:clj-kondo/ignore [:redundant-do]}
      (do
        (when (not (aget (.-colors theme) key))
          (js-delete (.-colors theme) "key"))))
    theme))

(defn write-theme-json
  "Write a theme to a JSON file"
  [name, path]
  (fs.writeFileSync
   path
   (js/JSON.stringify (make-theme name))))

(defn -main
  "Software starting point"
  [& args]
  (let [themes (list "base" "coffee" "gradient")]
    (doseq [theme themes]
      (if (= theme "base")
        (write-theme-json theme "theme/monotropic.json")
        (write-theme-json theme (str "theme/monotropic-" theme ".json"))))))

(-main)
